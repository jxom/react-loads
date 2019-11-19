import { LoadFunction, LoadsConfig } from './types';
import { useLoads } from './useLoads';
import { useDeferredLoads } from './useDeferredLoads';

type ResourceOptions<Response, Err> = {
  _namespace: string;
  [loadKey: string]: LoadFunction<Response> | [LoadFunction<Response>, LoadsConfig<Response, Err> | undefined] | string;
};

function createLoadsHooks<Response, Err>(opts: ResourceOptions<Response, Err>) {
  return Object.entries(opts).reduce((currentLoaders, [loadKey, val]) => {
    if (loadKey[0] === '_' || typeof val === 'string') return currentLoaders;

    let loader = val as LoadFunction<Response>;
    let config = {};
    if (Array.isArray(val)) {
      loader = val[0];
      config = val[1] || {};
    }

    if (loadKey === 'load') {
      return {
        ...currentLoaders,
        useLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useLoads(opts._namespace, loader, { ...config, ...loadsConfig }),
        useDeferredLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useDeferredLoads(opts._namespace, loader, { ...config, ...loadsConfig })
      };
    }

    config = { ...config, enableBackgroundStates: true };
    return {
      ...currentLoaders,
      [loadKey]: {
        useLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useLoads(opts._namespace, loader, { ...config, ...loadsConfig }),
        useDeferredLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useDeferredLoads(opts._namespace, loader, { ...config, ...loadsConfig })
      }
    };
  }, {});
}

export function createResource<Response, Err>(opts: ResourceOptions<Response, Err>) {
  return createLoadsHooks<Response, Err>(opts);
}
