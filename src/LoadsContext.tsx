import * as React from 'react';
import { CacheProvider, LoadsContextState, Record } from './types';

export const LoadsContext = React.createContext<LoadsContextState>({
  cache: { records: {}, get: () => {}, set: () => {} }
});

export function Provider({ children, cacheProvider }: { children: React.ReactNode; cacheProvider?: CacheProvider }) {
  const [records, setRecords] = React.useState<{ [key: string]: Record<unknown> }>({});

  const set = React.useCallback(
    (key: string, val: Record<unknown>, opts: { cacheProvider: CacheProvider | void }) => {
      setRecords(currentRecords => ({
        ...currentRecords,
        [key]: val
      }));
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
      return records[key];
    },
    [records, cacheProvider]
  );

  const value = React.useMemo<LoadsContextState>(() => ({ cache: { records, get, set } }), [records, get, set]);
  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export default {
  ...LoadsContext,
  Provider
};
