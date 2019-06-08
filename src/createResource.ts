import * as reactCache from './_temp/react-cache';
import { LoadFunction, LoadsConfig } from './types';
import useLoads from './useLoads';

type ResourceOptions<R> = {
  _key: string;
  [loadKey: string]: [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};

export default function unstable_createResource<R>(opts: ResourceOptions<R>) {
  const loaders = Object.entries(opts).reduce((currentLoaders, [loadKey, val]) => {
    if (loadKey[0] === '_' || typeof val === 'string') return currentLoaders;
    return {
      ...currentLoaders,
      [loadKey]: val
    };
  }, {});
  const resource = reactCache.unstable_createResource(loaders.load[0]);

  return {
    useLoads: (loadsConfig: LoadsConfig<R> | undefined) => useLoads(loaders, { context: opts._key, ...loadsConfig }),
    unstable_load: resource.read,
    unstable_preload: resource.preload
  };
}
