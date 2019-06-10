import { LoadFunction, Loaders, LoadsConfig, LoadingState } from './types';

const noop = async () => {};

export const STATES: { [key: string]: LoadingState } = {
  IDLE: 'idle',
  PENDING: 'pending',
  TIMEOUT: 'timeout',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

export function getLoadConfig<R>(fnOrLoaders: LoadFunction<R> | Loaders<R>, config: LoadsConfig<R>): LoadsConfig<R> {
  if (typeof fnOrLoaders === 'function') {
    return config;
  }
  if (typeof fnOrLoaders === 'object') {
    let context = config.context;
    if (config.hash) {
      context = `${config.context}.${config.hash}`;
    }

    if (fnOrLoaders.load[1]) {
      const loaderConfig = fnOrLoaders.load[1];
      return { ...loaderConfig, ...config, context };
    }
    return { ...config, context };
  }

  return config;
}

export function getLoadFunction<R>(fnOrLoaders: LoadFunction<R> | Loaders<R>, config: LoadsConfig<R>): LoadFunction<R> {
  if (typeof fnOrLoaders === 'function') {
    return fnOrLoaders;
  }
  if (typeof fnOrLoaders === 'object' && fnOrLoaders.load[0]) {
    const loaderType = config.type || 'load';
    return fnOrLoaders[loaderType][0];
  }

  // @ts-ignore
  return noop;
}
