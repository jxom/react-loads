export type CacheProvider = { get: (key: string) => any; set: (key: string, value: any) => void };
export type LoadsConfig = {
  cacheProvider?: CacheProvider;
  context?: string;
  delay?: number;
  enableBackgroundStates?: boolean;
  defer?: boolean;
  loadPolicy?: 'cache-first' | 'cache-and-load' | 'load-only';
  timeout?: number;
};
export type LoadFunction = (opts?: any) => Promise<any>;
export type LoadingState = 'idle' | 'pending' | 'timeout' | 'resolved' | 'rejected';
export type Record = { error?: any; response?: any; isCached?: boolean; state: LoadingState };
