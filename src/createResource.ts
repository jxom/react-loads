import { LoadFunction, LoadsConfig } from './types';
import { preload } from './preload';
import { useLoads } from './useLoads';
import { useDeferredLoads } from './useDeferredLoads';

type ResourceOptions<Response, Err> = {
  context: string;
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
        preload: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          preload(opts.context, loader, { ...config, ...loadsConfig }),
        useLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useLoads(opts.context, loader, { ...config, ...loadsConfig }),
        useDeferredLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useDeferredLoads(opts.context, loader, { ...config, ...loadsConfig })
      };
    }

    return {
      ...currentLoaders,
      [loadKey]: {
        preload: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          preload(opts.context, loader, { ...config, ...loadsConfig }),
        useLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useLoads(opts.context, loader, { ...config, ...loadsConfig }),
        useDeferredLoads: (loadsConfig: LoadsConfig<Response, Err> | undefined) =>
          useDeferredLoads(opts.context, loader, { ...config, ...loadsConfig })
      }
    };
  }, {});
}

export function createResource<Response, Err>(opts: ResourceOptions<Response, Err>) {
  return {
    ...createLoadsHooks<Response, Err>(opts)
  };
}
