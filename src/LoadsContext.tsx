import * as React from 'react';
import { CacheProvider, LoadsContextState, Record } from './types';

export const LoadsContext = React.createContext<LoadsContextState>({
  cache: { records: {}, get: () => {}, set: () => {}, reset: () => {} }
});

export function Provider({ children, cacheProvider }: { children: React.ReactNode; cacheProvider?: CacheProvider }) {
  const [records, setRecords] = React.useState<{ [key: string]: Record<unknown> }>({});

  const reset = React.useCallback(
    (opts?: { cacheProvider?: CacheProvider | void }) => {
      setRecords({});

      const _cacheProvider = opts && opts.cacheProvider ? opts.cacheProvider : cacheProvider;
      if (_cacheProvider) {
        _cacheProvider.reset();
      }

      return;
    },
    [cacheProvider]
  );

  const set = React.useCallback(
    (key: string, val: Record<unknown>, opts?: { cacheProvider?: CacheProvider | void }) => {
      setRecords(currentRecords => ({
        ...currentRecords,
        [key]: val
      }));

      const _cacheProvider = opts && opts.cacheProvider ? opts.cacheProvider : cacheProvider;
      if (_cacheProvider) {
        _cacheProvider.set(key, val);
      }

      return;
    },
    [cacheProvider]
  );
  const get = React.useCallback(
    (key: string, opts?: { cacheProvider?: CacheProvider | void }) => {
      // First, check to see if the record exists in the context cache.
      const record = records[key];
      if (record) {
        return record;
      }

      // Otherwise, fallback to the cache provider.
      const _cacheProvider = opts && opts.cacheProvider ? opts.cacheProvider : cacheProvider;
      if (_cacheProvider) {
        const value = _cacheProvider.get(key);
        if (value) {
          return value;
        }
      }

      return undefined;
    },
    [cacheProvider, records]
  );

  const value = React.useMemo<LoadsContextState>(() => ({ cache: { records, get, set, reset } }), [
    get,
    records,
    reset,
    set
  ]);
  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export default {
  ...LoadsContext,
  Provider
};
