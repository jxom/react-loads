import * as cache from './cache';
import { STATES, LOAD_POLICIES } from './constants';
import { defaultConfig } from './LoadsConfig';
import { useLoads } from './useLoads';
import * as utils from './utils';
import { ContextArg, ConfigArg, FnArg, LoadFunction, LoadingState, OptimisticCallback, Record } from './types';

export function preload<Response, Err>(
  context: ContextArg,
  promiseOrFn: FnArg<Response>,
  localConfig?: ConfigArg<Response, Err>
) {
  const config = { ...defaultConfig, ...(localConfig || {}) };
  const {
    cacheTime,
    cacheProvider,
    cacheStrategy,
    dedupingInterval,
    loadPolicy,
    onResolve,
    onReject,
    rejectRetryInterval,
    revalidateTime,
    suspense,
    throwError,
    variables
  } = config;

  function setData({ cacheKey, record }: { cacheKey: string; record: Record<Response, Err> }) {
    const config = {
      cacheProvider,
      cacheTime
    };
    cache.records.set<Response, Err>(cacheKey, record, config);
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
    const cacheKey = utils.getCacheKey({ context, variablesHash, cacheStrategy });

    if (!cacheKey) throw new Error('preload() must have a context');

    let cachedRecord: any;
    if (loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
      cachedRecord = cache.records.get(cacheKey);
    }

    if (cachedRecord) {
      // @ts-ignore
      const isStale = Math.abs(new Date() - cachedRecord.updated) >= revalidateTime;
      const isDuplicate =
        // @ts-ignore
        Math.abs(new Date() - cachedRecord.updated) < dedupingInterval;
      const isCachedWithCacheFirst = !isStale && loadPolicy === LOAD_POLICIES.CACHE_FIRST;
      if (isDuplicate || isCachedWithCacheFirst) return;
    }

    let promise = promiseOrFn(...args);
    if (typeof promise === 'function') {
      promise = promise({ cachedRecord });
    }

    const isReloading = Boolean(cachedRecord);
    cache.records.set<Response, Err>(
      cacheKey,
      record => ({
        ...record,
        state: cachedRecord ? STATES.RELOADING : STATES.PENDING
      }),
      { cacheTime, cacheProvider }
    );
    if (!isReloading) {
      cache.promises.set(cacheKey, promise);
    }

    if (typeof promise === 'function') return;
    promise
      .then(response => {
        const record = { error: undefined, response, state: STATES.RESOLVED };
        setData({ cacheKey, record });

        onResolve && onResolve(response);
      })
      .catch(error => {
        const record = { response: undefined, error, state: STATES.REJECTED };
        setData({ cacheKey, record });

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
        cache.promises.delete(cacheKey);
      });
  }
  load();

  return {
    useLoads: (loadsConfig: ConfigArg<Response, Err> = {}) =>
      useLoads(context, promiseOrFn, { ...config, ...loadsConfig, loadPolicy: LOAD_POLICIES.CACHE_ONLY })
  };
}
