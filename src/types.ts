import * as React from 'react';

export type CacheProvider = { get: (key: string) => any; set: (key: string, value: any) => void };
export type LoadsConfig<R> = {
  cacheProvider?: CacheProvider;
  context?: string;
  delay?: number;
  enableBackgroundStates?: boolean;
  unstable_enableSuspense?: boolean;
  defer?: boolean;
  loadPolicy?: 'cache-first' | 'cache-and-load' | 'load-only';
  timeout?: number;
  update?: LoadFunction<R>;
};
export type LoadsContextState = {
  cache: {
    records: { [key: string]: any };
    get: (key: string, opts: { cacheProvider: CacheProvider | void }) => any;
    set: (key: string, val: Record<any>, opts: { cacheProvider: CacheProvider | void }) => any;
  };
  unstable_enableSuspense: boolean;
};
export type LoadFunction<R> = (opts?: any) => Promise<R>;
export type LoadingState = 'idle' | 'pending' | 'timeout' | 'resolved' | 'rejected';
export type OptimisticCallback = (newData: any) => void;
export type OptimisticOpts<R> = {
  context?: LoadsConfig<R>['context'];
};
export type Record<R> = { error?: any; response?: R; isCached?: boolean; state: LoadingState };
export type StateComponentProps = {
  children: ((loader: any) => React.ReactNode) | React.ReactNode;
  or?: Array<any> | any;
};
