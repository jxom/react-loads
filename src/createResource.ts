import { LoadFunction, LoadsConfig, Record } from './types';
import useLoads from './useLoads';

type ResourceOptions<R> = {
  _namespace: string;
  [loadKey: string]: LoadFunction<R> | [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};

function createLoadsHooks<R>(opts: ResourceOptions<R>) {
  return Object.entries(opts).reduce((currentLoaders, [loadKey, val]) => {
    if (loadKey[0] === '_' || typeof val === 'string') return currentLoaders;

    let loader = val as LoadFunction<R>;
    let config = {};
    if (Array.isArray(val)) {
      loader = val[0];
      config = val[1] || {};
    }

    if (loadKey === 'load') {
      return {
        ...currentLoaders,
        useLoads: (loadsConfig: LoadsConfig<R> | undefined) =>
          useLoads(opts._namespace, loader, { ...config, ...loadsConfig })
      };
    }

    config = { ...config, enableBackgroundStates: true };
    return {
      ...currentLoaders,
      [loadKey]: {
        useLoads: (loadsConfig: LoadsConfig<R> | undefined) =>
          useLoads(opts._namespace, loader, { ...config, ...loadsConfig })
      }
    };
  }, {});
}

export default function createResource<R>(opts: ResourceOptions<R>) {
  return createLoadsHooks<R>(opts);
}
