import * as React from 'react';
import { LoadsContext } from './LoadsContext';
import { LoadFunction, LoadsConfig, Record } from './types';
import useLoads from './useLoads';
import * as utils from './utils';

type LoadsSuspenderOpts = { accessKey?: string; params?: Array<unknown> };
type ResourceOptions<R> = {
  _key: string;
  [loadKey: string]: [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};

const STATES = utils.STATES;

function readContext() {
  // @ts-ignore
  const dispatcher = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentDispatcher.current;
  if (dispatcher === null) {
    throw new Error(
      'react-loads: load and preload may only be called from within a ' +
        "component's render. They are not supported in event handlers or " +
        'lifecycle methods.'
    );
  }
  return dispatcher.readContext(LoadsContext);
}

function createLoadsSuspender<R>(opts: ResourceOptions<R>, { type = 'load' }: { type?: string } = {}) {
  const loader = opts[type][0];

  return ({ accessKey, params = [] }: LoadsSuspenderOpts = {}) => {
    const globalContext = readContext();

    let key = opts._key;
    if (accessKey) {
      key = `${key}.${accessKey}`;
    }

    let record: Record<R> = globalContext.cache.get(key);
    if (typeof loader !== 'function') return record;

    const promise = loader(...params);

    if (record === undefined) {
      record = {
        state: STATES.PENDING,
        promise
      };
      globalContext.cache.set(key, record);
    }

    promise
      .then(response => {
        record = {
          state: STATES.RESOLVED,
          response
        };
        globalContext.cache.set(key, record);
      })
      .catch(error => {
        record = {
          state: STATES.REJECTED,
          error
        };
        globalContext.cache.set(key, record);
      });

    if (record.state === STATES.PENDING) {
      throw record.promise;
    }
    if (record.state === STATES.RESOLVED) {
      return record.response;
    }
    if (record.state === STATES.REJECTED) {
      return record.error;
    }

    return;
  };
}

export default function unstable_createResource<R>(opts: ResourceOptions<R>) {
  const loaders = Object.entries(opts).reduce((currentLoaders, [loadKey, val]) => {
    if (loadKey[0] === '_' || typeof val === 'string') return currentLoaders;
    return {
      ...currentLoaders,
      [loadKey]: val
    };
  }, {});

  return {
    useLoads: (loadsConfig: LoadsConfig<R> | undefined) => useLoads(loaders, { context: opts._key, ...loadsConfig }),
    unstable_load: createLoadsSuspender(opts)
  };
}
