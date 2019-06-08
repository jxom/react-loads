import { LoadFunction, Loaders, LoadsConfig } from './types';

const noop = async () => {};

export function getLoadConfig<R>(fnOrLoaders: LoadFunction<R> | Loaders<R>, config: LoadsConfig<R>): LoadsConfig<R> {
  if (typeof fnOrLoaders === 'function') {
    return config;
  }
  if (typeof fnOrLoaders === 'object') {
    const context = `${config.context}.${config.id}`;
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
