import * as React from 'react';
import { CacheProvider, LoadsContextState, Record } from './types';

export const LoadsContext = React.createContext<LoadsContextState>({
  cache: { records: {}, get: () => {}, set: () => {} },
  unstable_enableSuspense: false
});

const records = new Map();

export function Provider({
  children,
  cacheProvider,
  unstable_enableSuspense = false
}: {
  children: React.ReactNode;
  cacheProvider?: CacheProvider;
  unstable_enableSuspense?: boolean;
}) {
  const set = React.useCallback(
    (key: string, val: Record<unknown>, opts: { cacheProvider?: CacheProvider | void } = {}) => {
      records.set(key, val);
      const _cacheProvider = opts.cacheProvider || cacheProvider;
      if (_cacheProvider) {
        _cacheProvider.set(key, val);
      }
      return;
    },
    [cacheProvider]
  );
  const get = React.useCallback(
    (key: string, opts: { cacheProvider?: CacheProvider | void } = {}) => {
      const _cacheProvider = opts.cacheProvider || cacheProvider;
      if (_cacheProvider) {
        const value = _cacheProvider.get(key);
        if (value) {
          return value;
        }
      }
      return records.get(key);
    },
    [cacheProvider]
  );

  const value = React.useMemo<LoadsContextState>(() => ({ cache: { records, get, set }, unstable_enableSuspense }), [
    get,
    set,
    unstable_enableSuspense
  ]);
  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export default {
  ...LoadsContext,
  Provider
};
