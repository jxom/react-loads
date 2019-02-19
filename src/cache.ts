// @ts-ignore
import { LRUMap } from 'lru_map';
import { CacheProvider, Record } from './types';

const CACHE_LIMIT = 500;
const cache = new LRUMap<string, Record>(CACHE_LIMIT);

let cacheProvider: CacheProvider;
export function setCacheProvider(provider: CacheProvider) {
  if (!provider.set || !provider.get) {
    throw new Error('Your cache provider must contain `get` and `set` functions.');
  }
  if (cacheProvider) {
    console.error(
      'Warning: A cache provider is being overridden with another `setCacheProvider`. Ensure only one `setCacheProvider` exists.'
    );
  }
  cacheProvider = provider;
}

export default {
  set(key: string, val: Record, opts: { cacheProvider: CacheProvider | void }) {
    cache.set(key, val);
    const _cacheProvider = opts.cacheProvider || cacheProvider;
    if (_cacheProvider) {
      _cacheProvider.set(key, val);
    }
    if (this.onSet) {
      this.onSet(key, val);
    }
    return;
  },
  get(key: string, opts: { cacheProvider: CacheProvider | void }) {
    const _cacheProvider = opts.cacheProvider || cacheProvider;
    if (_cacheProvider) {
      const value = _cacheProvider.get(key);
      if (value) {
        return value;
      }
    }
    return cache.get(key);
  },
  // @ts-ignore
  onSet: (key: string, val: Record): void => undefined
};
