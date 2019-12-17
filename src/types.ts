export type CacheProvider = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
  clear: () => void;
  delete: (key: string) => void;
};
export type CacheStrategy = 'context-and-variables' | 'context-only';
export type LoadsConfig<Response, Err> = {
  cacheProvider?: CacheProvider;
  cacheStrategy?: CacheStrategy;
  cacheTime?: number;
  context?: string;
  dedupingInterval?: number;
  delay?: number;
  defer?: boolean;
  enableBackgroundStates?: boolean;
  initialResponse?: Response;
  loadPolicy?: LoadPolicy;
  onReject?: (error: Err) => void;
  onResolve?: (response: Response) => void;
  pollingInterval?: number;
  pollWhenHidden?: boolean;
  rejectRetryInterval?: number | ((count: number) => number);
  revalidateTime?: number;
  revalidateOnWindowFocus?: boolean;
  suspense?: boolean;
  throwError?: boolean;
  timeout?: number;
  update?: LoadFunction<Response>;
  variables?: Array<unknown> | (() => Array<unknown>);
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
export type OptimisticContext = { context: string; variables?: Array<any> };
export type OptimisticOpts<Response, Err> = {
  context?: LoadsConfig<Response, Err>['context'];
};
export type Record<Response, Err> = {
  error: Err | undefined;
  response: Response | undefined;
  state: LoadingState;
  isCached?: boolean;
  cacheTimeout?: any;
  updated?: Date;
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
