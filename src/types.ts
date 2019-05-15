export type CacheProvider = { get: (key: string) => any; set: (key: string, value: any) => void };
export type LoadsConfig = {
  cacheProvider?: CacheProvider;
  context?: string;
  delay?: number;
  enableBackgroundStates?: boolean;
  defer?: boolean;
  loadPolicy?: 'cache-first' | 'cache-and-load' | 'load-only';
  timeout?: number;
  update?: LoadFunction;
};
export type LoadsContextState = {
  get: (key: string, opts: { cacheProvider: CacheProvider | void }) => any;
  set: (key: string, val: Record, opts: { cacheProvider: CacheProvider | void }) => any;
};
export type LoadFunction = (opts?: any) => Promise<any>;
export type LoadingState = 'idle' | 'pending' | 'timeout' | 'resolved' | 'rejected';
export type OptimisticCallback = (newData: any) => void;
export type OptimisticOpts = {
  context?: LoadsConfig['context'];
};
export type Record = { error?: any; response?: any; isCached?: boolean; state: LoadingState };
