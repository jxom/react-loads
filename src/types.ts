import * as React from 'react';

export type CacheProvider = { get: (key: string) => any; set: (key: string, value: any) => void };
export type LoadsConfig<R> = {
  args?: Array<unknown>;
  cacheProvider?: CacheProvider;
  context?: string;
  delay?: number;
  defer?: boolean;
  enableBackgroundStates?: boolean;
  id?: string;
  loadPolicy?: 'cache-first' | 'cache-and-load' | 'load-only';
  timeout?: number;
  update?: LoadFunction<R>;
};
export type LoadsContextState = {
  cache: {
    records: { [key: string]: any };
    get: (key: string, opts?: { cacheProvider: CacheProvider | void }) => any;
    set: (key: string, val: Record<any>, opts?: { cacheProvider: CacheProvider | void }) => any;
  };
};
export type LoadFunction<R> = (opts?: any) => Promise<R>;
export type LoadingState = 'idle' | 'pending' | 'timeout' | 'resolved' | 'rejected';
export type Loaders<R> = { [loadKey: string]: LoadFunction<R> | [LoadFunction<R>, LoadsConfig<R> | undefined] };
export type OptimisticCallback = (newData: any) => void;
export type OptimisticOpts<R> = {
  context?: LoadsConfig<R>['context'];
};
export type Record<R> = {
  error?: any;
  response?: R;
  isCached?: boolean;
  promise?: Promise<unknown>;
  state: LoadingState;
};
export type StateComponentProps = {
  children: ((loader: any) => React.ReactNode) | React.ReactNode;
  or?: Array<any> | any;
};
