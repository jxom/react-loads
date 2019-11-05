import * as React from 'react';

export type CacheProvider = { get: (key: string) => any; set: (key: string, value: any) => void; reset: () => void };
export type LoadsConfig<R> = {
  args?: Array<unknown>;
  cacheProvider?: CacheProvider;
  context?: string;
  delay?: number;
  defer?: boolean;
  enableBackgroundStates?: boolean;
  id?: string;
  injectMeta?: boolean;
  loadPolicy?: LoadPolicy;
  suspense?: boolean;
  throwError?: boolean;
  timeout?: number;
  update?: LoadFunction<R>;
};
export type LoadsContextState = {
  cache: {
    records: { [key: string]: any };
    get: (key: string, opts?: { cacheProvider: CacheProvider | void }) => any;
    set: (key: string, val: Record<any>, opts?: { cacheProvider: CacheProvider | void }) => any;
    reset: (opts?: { cacheProvider: CacheProvider | void }) => any;
  };
};
export type LoadFunction<R> = (opts?: any) => Promise<R>;
export type LoadPolicy = 'cache-first' | 'cache-and-load' | 'load-only' | 'cache-only';
export type LoadingState =
  | 'idle'
  | 'pending'
  | 'pending-slow'
  | 'resolved'
  | 'rejected'
  | 'reloading'
  | 'reloading-slow';
export type Loaders<R> = { [loadKey: string]: LoadFunction<R> | [LoadFunction<R>, LoadsConfig<R> | undefined] };
export type OptimisticCallback = (newData: any) => void;
export type OptimisticOpts<R> = {
  context?: LoadsConfig<R>['context'];
};
export type Record<R> = {
  error?: any;
  response?: R;
  promise?: Promise<R>;
  isCached?: boolean;
  state: LoadingState;
};
