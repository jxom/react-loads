import { LoadFunction, LoadsConfig, Record } from './types';
import useLoads from './useLoads';
import * as utils from './utils';

type LoadsSuspenderOpts = { hash?: string; params?: Array<unknown> };
type ResourceOptions<R> = {
  _key: string;
  [loadKey: string]: [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};

const STATES = utils.STATES;

const records = new Map();

function createLoadsSuspender<R>(opts: ResourceOptions<R>, { preload = false }: { preload?: boolean } = {}) {
  const loader = opts.load[0];

  return ({ hash, params = [] }: LoadsSuspenderOpts = {}): R | undefined => {
    let key = opts._key;
    if (hash) {
      key = `${key}.${hash}`;
    }

    let record: Record<R> = records.get(key);
    if (typeof loader !== 'function') throw new Error('TODO');

    const promise = loader(...params);

    if (record === undefined) {
      record = {
        state: STATES.PENDING,
        promise
      };
      records.set(key, record);
    }

    promise
      .then(response => {
        record = {
          state: STATES.RESOLVED,
          response
        };
        records.set(key, record);
      })
      .catch(error => {
        record = {
          state: STATES.REJECTED,
          error
        };
        records.set(key, record);
      });

    if (!preload) {
      if (record.state === STATES.PENDING) {
        throw record.promise;
      }
      if (record.state === STATES.RESOLVED && record.response) {
        return record.response;
      }
      if (record.state === STATES.REJECTED) {
        return record.error;
      }
    }
    return undefined;
  };
}

function createLoadsHook<R>(opts: ResourceOptions<R>) {
  const loaders = Object.entries(opts).reduce((currentLoaders, [loadKey, val]) => {
    if (loadKey[0] === '_' || typeof val === 'string') return currentLoaders;
    return {
      ...currentLoaders,
      [loadKey]: val
    };
  }, {});
  return (loadsConfig: LoadsConfig<R> | undefined) => useLoads(loaders, { context: opts._key, ...loadsConfig });
}

export default function createResource<R>(opts: ResourceOptions<R>) {
  return {
    useLoads: createLoadsHook<R>(opts),
    unstable_load: createLoadsSuspender<R>(opts),
    unstable_preload: createLoadsSuspender<R>(opts, { preload: true })
  };
}
