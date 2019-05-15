import * as React from 'react';
import { CacheProvider, LoadsContextState, Record } from './types';

export const LoadsContext = React.createContext<LoadsContextState>({ get: () => {}, set: () => {} });

export function Provider({ children, cacheProvider }: { children: React.ReactNode; cacheProvider: CacheProvider }) {
  const [cache, setCache] = React.useState<{ [key: string]: Record }>({});
  function set(key: string, val: Record, opts: { cacheProvider: CacheProvider | void }) {
    setCache(cache => ({
      ...cache,
      [key]: val
    }));
    const _cacheProvider = opts.cacheProvider || cacheProvider;
    if (_cacheProvider) {
      _cacheProvider.set(key, val);
    }
    return;
  }
  function get(key: string, opts: { cacheProvider: CacheProvider | void }) {
    const _cacheProvider = opts.cacheProvider || cacheProvider;
    if (_cacheProvider) {
      const value = _cacheProvider.get(key);
      if (value) {
        return value;
      }
    }
    return cache[key];
  }
  const value = React.useMemo<LoadsContextState>(() => ({ get, set }), [get, set]);
  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export default {
  ...LoadsContext,
  Provider
};
