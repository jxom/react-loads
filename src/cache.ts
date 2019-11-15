import { LOAD_POLICIES } from './constants';
import { CacheProvider, LoadsConfig, Record } from './types';

////////////////////////////////////////////////////////

export const globalConfig = {
  delay: 0,
  enableBackgroundStates: false,
  defer: false,
  loadPolicy: LOAD_POLICIES.CACHE_AND_LOAD,
  suspense: false,
  throwError: false,
  timeout: 0
};

export function setConfig(config: LoadsConfig<unknown, unknown>) {
  Object.assign(globalConfig, config);
}

////////////////////////////////////////////////////////

const recordsCache = new Map();
export const records = {
  ...recordsCache,
  set<Response, Err>(
    key: string,
    valOrFn: Record<Response, Err> | ((record: Record<Response, Err>) => Record<Response, Err>),
    opts?: { cacheProvider?: CacheProvider | void }
  ) {
    let val = valOrFn;
    if (typeof val === 'function') {
      const record = recordsCache.get(key);
      val = val(record || {});
    }

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

export const suspenders = new Map();
export const promises = new Map();
export const updaters = new Map();
