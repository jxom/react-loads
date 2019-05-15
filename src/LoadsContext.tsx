import * as React from 'react';
import { CacheProvider, LoadsContextState, Record } from './types';

export const LoadsContext = React.createContext<LoadsContextState>({ get: () => {}, set: () => {} });

export function Provider({ children, cacheProvider }: { children: React.ReactNode; cacheProvider: CacheProvider }) {
  const [cache, setCache] = React.useState<{ [key: string]: Record }>({});
  console.log(cache);

  const set = React.useCallback(
    (key: string, val: Record, opts: { cacheProvider: CacheProvider | void }) => {
      setCache({
        [key]: val
      });
      const _cacheProvider = opts.cacheProvider || cacheProvider;
      if (_cacheProvider) {
        _cacheProvider.set(key, val);
      }
      return;
    },
    [cacheProvider]
  );
  const get = React.useCallback(
    (key: string, opts: { cacheProvider: CacheProvider | void }) => {
      const _cacheProvider = opts.cacheProvider || cacheProvider;
      if (_cacheProvider) {
        const value = _cacheProvider.get(key);
        if (value) {
          return value;
        }
      }
      return cache[key];
    },
    [cache, cacheProvider]
  );

  const value = React.useMemo<LoadsContextState>(() => ({ get, set }), [get, set]);
  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export default {
  ...LoadsContext,
  Provider
};
