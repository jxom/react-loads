import { LoadFunction, LoadsConfig, Record } from './types';
import useLoads from './useLoads';
import * as constants from './constants';

type LoadsSuspenderOpts = { id?: string | Array<string>; args?: Array<unknown> };
type ResourceOptions<R> = {
  _namespace: string;
  [loadKey: string]: LoadFunction<R> | [LoadFunction<R>, LoadsConfig<R> | undefined] | string;
};

/* ====== START: SUSPENDER CREATOR ====== */

const STATES = constants.STATES;

const records = new Map();

function load<R>({
  config = {},
  loadPolicy,
  loader,
  key
}: {
  config: LoadsSuspenderOpts;
  loadPolicy?: LoadsConfig<R>['loadPolicy'];
  loader: LoadFunction<R>;
  key: string;
}) {
  const id = Array.isArray(config.id) ? config.id.join('.') : config.id;
  if (id) {
    key = `${key}.${id}`;
  }

  let record: Record<R> = records.get(key);

  if (loadPolicy === constants.LOAD_POLICIES.CACHE_ONLY) return record;

  const promise = loader(...(config.args || []));

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

  return record;
}

function createLoadsSuspender<R>({
  key,
  loader,
  globalConfig,
  preload
}: {
  key: string;
  loader: LoadFunction<R>;
  globalConfig: LoadsSuspenderOpts;
  preload?: boolean;
}) {
  return (config: LoadsSuspenderOpts = {}): R | undefined => {
    const record = load({
      config: globalConfig.args ? globalConfig : config,
      loadPolicy: Boolean(globalConfig.args)
        ? constants.LOAD_POLICIES.CACHE_ONLY
        : constants.LOAD_POLICIES.CACHE_AND_LOAD,
      loader,
      key
    });

    if (preload) return undefined;

    if (record.state === STATES.PENDING) {
      throw record.promise;
    }
    if (record.state === STATES.RESOLVED && record.response) {
      return record.response;
    }
    if (record.state === STATES.REJECTED) {
      throw record.error;
    }
    return undefined;
  };
}

function createLoadsSuspenders<R>(opts: ResourceOptions<R>) {
  const key = opts._namespace;
  let globalConfig: LoadsSuspenderOpts = {};

  let loader = opts.load;
  if (Array.isArray(opts.load)) {
    loader = opts.load[0];
    globalConfig = opts.load[1] || {};
  }

  if (typeof loader !== 'function') throw new Error('TODO');

  if (globalConfig.args) {
    load({ config: globalConfig, loader, key });
  }

  return {
    unstable_load: createLoadsSuspender<R>({ key, loader, globalConfig }),
    unstable_preload: createLoadsSuspender<R>({ key, loader, globalConfig, preload: true })
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
    ...createLoadsSuspenders<R>(opts)
  };
}
