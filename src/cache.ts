import { LOAD_POLICIES } from './constants';
import { CacheProvider, LoadsConfig, Record } from './types';

////////////////////////////////////////////////////////

export const globalConfig = {
  delay: 0,
  enableBackgroundStates: false,
  defer: false,
  injectMeta: false,
  loadPolicy: LOAD_POLICIES.CACHE_AND_LOAD,
  suspense: false,
  throwError: false,
  timeout: 0
};

export function setConfig(config: LoadsConfig<unknown>) {
  Object.assign(globalConfig, config);
}

////////////////////////////////////////////////////////

const recordsCache = new Map();
export const records = {
  ...recordsCache,
  set<R>(key: string, val: Record<R>, opts?: { cacheProvider?: CacheProvider | void }) {
    recordsCache.set(key, val);

    if (opts && opts.cacheProvider) {
      opts.cacheProvider.set(key, val);
    }

    return;
  },
  get<R>(key: string, opts?: { cacheProvider?: CacheProvider | void }): Record<R> | undefined {
    // First, check to see if the record exists in the cache.
    const record = recordsCache.get(key);
    if (record) {
      return record as Record<R>;
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
