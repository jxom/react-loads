import { LoadFunction, LoadsConfig, Record } from './types';
import useLoads from './useLoads';
import * as constants from './constants';

type LoadsSuspenderOpts = { id?: string; args?: Array<unknown> };
type ResourceOptions<R> = {
  _namespace: string;
  [loadKey: string]: LoadFunction<R> | [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};

/* ====== START: SUSPENDER CREATOR ====== */

const STATES = constants.STATES;

const records = new Map();

function createLoadsSuspender<R>(opts: ResourceOptions<R>, { preload = false }: { preload?: boolean } = {}) {
  let loader = opts.load;
  if (Array.isArray(opts.load)) {
    loader = opts.load[0];
  }

  return ({ id, args = [] }: LoadsSuspenderOpts = {}): R | undefined => {
    let key = opts._namespace;
    if (id) {
      key = `${key}.${id}`;
    }

    let record: Record<R> = records.get(key);
    if (typeof loader !== 'function') throw new Error('TODO');

    const promise = loader(...args);

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

/* ====== END: SUSPENDER CREATOR ====== */

/* ====== START: HOOK CREATOR ====== */

function createLoadsHook<R>(loader: LoadFunction<R>, config: LoadsConfig<R>, opts: ResourceOptions<R>) {
  return (loadsConfig: LoadsConfig<R> | undefined, inputs: Array<any>) =>
    useLoads(loader, { context: opts._namespace, ...config, ...loadsConfig }, inputs);
}

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
        useLoads: createLoadsHook(loader, config, opts)
      };
    }

    config = { ...config, enableBackgroundStates: true };
    return {
      ...currentLoaders,
      [loadKey]: {
        useLoads: createLoadsHook(loader, config, opts)
      }
    };
  }, {});
}

/* ====== END: HOOK CREATOR ====== */

export default function createResource<R>(opts: ResourceOptions<R>) {
  return {
    ...createLoadsHooks<R>(opts),
    unstable_load: createLoadsSuspender<R>(opts),
    unstable_preload: createLoadsSuspender<R>(opts, { preload: true })
  };
}
