export type CacheProvider = { get: (key: string) => any; set: (key: string, value: any) => void; reset: () => void };
export type LoadsConfig<Response, Err> = {
  cacheProvider?: CacheProvider;
  context?: string;
  delay?: number;
  defer?: boolean;
  enableBackgroundStates?: boolean;
  loadPolicy?: LoadPolicy;
  onReject?: (error: Err) => void;
  onResolve?: (response: Response) => void;
  suspense?: boolean;
  throwError?: boolean;
  timeout?: number;
  update?: LoadFunction<Response>;
  variables?: Array<unknown> | (() => Array<unknown>);
};
export type LoadsContextState = {
  cache: {
    records: { [key: string]: any };
    get: (key: string, opts?: { cacheProvider: CacheProvider | void }) => any;
    set: (key: string, val: Record<any, any>, opts?: { cacheProvider: CacheProvider | void }) => any;
    reset: (opts?: { cacheProvider: CacheProvider | void }) => any;
  };
};
export type LoadFunction<Response> = (opts?: any) => Promise<Response>;
export type LoadPolicy = 'cache-first' | 'cache-and-load' | 'load-only' | 'cache-only';
export type LoadingState =
  | 'idle'
  | 'pending'
  | 'pending-slow'
  | 'resolved'
  | 'rejected'
  | 'reloading'
  | 'reloading-slow';
export type Loaders<Response, Err> = {
  [loadKey: string]: LoadFunction<Response> | [LoadFunction<Response>, LoadsConfig<Response, Err> | undefined];
};
export type OptimisticCallback = (newData: any) => void;
export type OptimisticOpts<Response, Err> = {
  context?: LoadsConfig<Response, Err>['context'];
};
export type Record<Response, Err> = {
  error: Err | undefined;
  response: Response | undefined;
  isCached?: boolean;
  state: LoadingState;
};
export type ResponseRecord<Response, Err> = {
  load: (...args: any) => Promise<Response | void | undefined>;
  update:
    | ((...args: any) => Promise<Response | void | undefined>)
    | Array<(...args: any) => Promise<Response | void | undefined>>;
  reset: () => void;
  response: Response | undefined;
  error: Err | undefined;
  state: LoadingState;
  isCached: boolean;
  isIdle: boolean;
  isPending: boolean;
  isPendingSlow: boolean;
  isReloading: boolean;
  isReloadingSlow: boolean;
  isResolved: boolean;
  isRejected: boolean;
};
export type ContextArg = string | Array<string>;
export type FnArg<Response> = LoadFunction<Response> | ((args?: any) => LoadFunction<Response>);
export type ConfigArg<Response, Err> = LoadsConfig<Response, Err>;
