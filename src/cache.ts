import { LOAD_POLICIES, CACHE_STRATEGIES } from './constants';
import { CacheProvider, LoadsConfig, Record } from './types';

////////////////////////////////////////////////////////

export const globalConfig = {
  cacheTime: 0,
  cacheStrategy: CACHE_STRATEGIES.CONTEXT_AND_VARIABLES,
  dedupingInterval: 500,
  delay: 0,
  defer: false,
  enableBackgroundStates: false,
  loadPolicy: LOAD_POLICIES.CACHE_AND_LOAD,
  revalidateOnWindowFocus: false,
  revalidateTime: 300000,
  suspense: false,
  throwError: false,
  timeout: 5000
};

export function setConfig(config: LoadsConfig<unknown, unknown>) {
  Object.assign(globalConfig, config);
}

////////////////////////////////////////////////////////

const recordsCache = new Map();
export const records = {
  clear(opts?: { cacheProvider?: CacheProvider | void }) {
    recordsCache.clear();

    if (opts && opts.cacheProvider) {
      opts.cacheProvider.clear();
    }

    return;
  },
  delete(key: string, opts?: { cacheProvider?: CacheProvider | void }) {
    recordsCache.delete(key);

    if (opts && opts.cacheProvider) {
      opts.cacheProvider.delete(key);
    }

    return;
  },
  set<Response, Err>(
    key: string,
    valOrFn: Record<Response, Err> | ((record: Record<Response, Err>) => Record<Response, Err>),
    opts: { cacheTime?: number; cacheProvider?: CacheProvider | void }
  ) {
    const record = recordsCache.get(key);
    if (record && record.cacheTimeout) {
      clearTimeout(record.cacheTimeout);
    }

    let val = valOrFn;
    if (typeof val === 'function') {
      val = val(record || {});
    }

    let cacheTimeout;
    if (opts && opts.cacheTime) {
      cacheTimeout = setTimeout(() => {
        records.delete(key);
      }, opts.cacheTime);
    }

    // Set an updated timestamp on the cached record
    val = { ...val, cacheTimeout, updated: new Date() };

    recordsCache.set(key, val);
    if (opts && opts.cacheProvider) {
      opts.cacheProvider.set(key, val);
    }

    return;
  },
  get<Response, Err>(key: string, opts?: { cacheProvider?: CacheProvider | void }): Record<Response, Err> | undefined {
    // First, check to see if the record exists in the cache.
    const record = recordsCache.get(key);
    if (record) {
      return record as Record<Response, Err>;
    }

    // Otherwise, fallback to the cache provider.
    if (opts && opts.cacheProvider) {
      const value = opts.cacheProvider.get(key);
      if (value) {
        return value;
      }
    }

    return undefined;
  }
};

////////////////////////////////////////////////////////

export const promises = new Map();
export const revalidators = new Map();
export const suspenders = new Map();
export const updaters = new Map();
