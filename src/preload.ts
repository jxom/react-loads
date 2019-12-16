import * as cache from './cache';
import { STATES, LOAD_POLICIES } from './constants';
import { useLoads } from './useLoads';
import * as utils from './utils';
import { ContextArg, ConfigArg, FnArg, LoadFunction, LoadingState, OptimisticCallback, Record } from './types';

export function preload<Response, Err>(
  context: ContextArg,
  promiseOrFn: FnArg<Response>,
  localConfig: ConfigArg<Response, Err> = {}
) {
  const config = { ...cache.globalConfig, ...localConfig };
  const {
    cacheTime,
    cacheProvider,
    cacheStrategy,
    loadPolicy,
    onResolve,
    onReject,
    rejectRetryInterval,
    suspense,
    throwError,
    variables
  } = config;

  function setData({ contextKey, record }: { contextKey: string; record: Record<Response, Err> }) {
    const config = {
      cacheProvider,
      cacheTime
    };
    cache.records.set<Response, Err>(contextKey, record, config);
  }

  let count = 0;
  function load() {
    count = count + 1;

    let args = variables || [];
    if (typeof args === 'function') {
      try {
        args = args() || [];
      } catch (err) {
        throw new Error('TODO');
      }
    }

    const variablesHash = JSON.stringify(args);
    const contextKey = utils.getContextKey({ context, variablesHash, cacheStrategy });

    if (!contextKey) throw new Error('preload() must have a context');

    let cachedRecord: any;
    if (loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
      cachedRecord = cache.records.get(contextKey);
    }

    if (cachedRecord && loadPolicy === LOAD_POLICIES.CACHE_FIRST) return;

    let promise = promiseOrFn(...args);
    if (typeof promise === 'function') {
      promise = promise({ cachedRecord });
    }

    const isReloading = Boolean(cachedRecord);
    cache.records.set<Response, Err>(
      contextKey,
      record => ({
        ...record,
        state: cachedRecord ? STATES.RELOADING : STATES.PENDING
      }),
      { cacheTime, cacheProvider }
    );
    if (!isReloading) {
      cache.promises.set(contextKey, promise);
    }

    if (typeof promise === 'function') return;
    promise
      .then(response => {
        const record = { error: undefined, response, state: STATES.RESOLVED };
        setData({ contextKey, record });

        onResolve && onResolve(response);
      })
      .catch(error => {
        const record = { response: undefined, error, state: STATES.REJECTED };
        setData({ contextKey, record });

        onReject && onReject(error);

        if (rejectRetryInterval) {
          const attemptCount = Math.min(count || 0, 8);
          const timeout =
            typeof rejectRetryInterval === 'function'
              ? rejectRetryInterval(attemptCount)
              : ~~((Math.random() + 0.5) * (1 << attemptCount)) * rejectRetryInterval;
          setTimeout(() => load(), timeout);
        }

        if (throwError && !suspense) {
          throw error;
        }
      })
      .finally(() => {
        cache.promises.delete(contextKey);
      });
  }
  load();

  return {
    useLoads: (loadsConfig: ConfigArg<Response, Err> = {}) =>
      useLoads(context, promiseOrFn, { ...config, ...loadsConfig, loadPolicy: LOAD_POLICIES.CACHE_ONLY })
  };
}
