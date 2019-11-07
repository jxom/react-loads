import * as React from 'react';

import * as cache from './cache';
import { LOAD_POLICIES, STATES } from './constants';
import useDetectMounted from './hooks/useDetectMounted';
import useTimeout from './hooks/useTimeout';
import { LoadsConfig, LoadFunction, LoadingState, OptimisticCallback, OptimisticOpts, Record } from './types';

function broadcastChanges<R>(contextKey: string, record: Record<R>) {
  const updaters = cache.updaters.get(contextKey);
  updaters.forEach((updater: any) => updater({ record, shouldBroadcast: false }));
}

const IDLE_RECORD = { error: undefined, response: undefined, state: STATES.IDLE };
function reducer<R>(
  state: Record<R>,
  action: { type: LoadingState; isCached?: boolean; response?: R; error?: any }
): Record<R> {
  switch (action.type) {
    case STATES.IDLE:
      return IDLE_RECORD;
    case STATES.PENDING:
      return { ...state, state: STATES.PENDING };
    case STATES.PENDING_SLOW:
      return { ...state, state: STATES.PENDING_SLOW };
    case STATES.RESOLVED:
      return { isCached: action.isCached, error: undefined, response: action.response, state: STATES.RESOLVED };
    case STATES.REJECTED:
      return { isCached: action.isCached, error: action.error, response: undefined, state: STATES.REJECTED };
    case STATES.RELOADING:
      return { ...state, state: STATES.RELOADING };
    case STATES.RELOADING_SLOW:
      return { ...state, state: STATES.RELOADING };
    default:
      return state;
  }
}

export default function useLoads<R>(fn: LoadFunction<R>, config: LoadsConfig<R> = {}) {
  const {
    cacheProvider,
    delay,
    enableBackgroundStates,
    defer,
    injectMeta,
    loadPolicy,
    suspense,
    throwError,
    timeout,
    update: updateFn
  } = { ...cache.globalConfig, ...config };
  const id = Array.isArray(config.id) ? config.id.join('.') : config.id;
  const contextKey = config.id ? `${config.context}.${id}` : config.context;

  const counter = React.useRef<number>(0);
  const [hasMounted, hasRendered] = useDetectMounted();
  const [setDelayTimeout, clearDelayTimeout] = useTimeout();
  const [setTimeoutTimeout, clearTimeoutTimeout] = useTimeout();

  const cachedRecord = React.useMemo(
    () => {
      if (contextKey) {
        return cache.records.get<R>(contextKey, { cacheProvider });
      }
      return;
    },
    [cacheProvider, contextKey]
  );

  let initialRecord: Record<R> = IDLE_RECORD;
  if (cachedRecord && !defer && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
    initialRecord = cachedRecord;
  }

  const [record, dispatch] = React.useReducer(reducer, initialRecord);

  const handleLoading = React.useCallback(
    ({ isReloading, isSlow, promise }) => {
      const reloadingState = isSlow ? STATES.RELOADING_SLOW : STATES.RELOADING;
      const pendingState = isSlow ? STATES.PENDING_SLOW : STATES.PENDING;
      dispatch({ type: isReloading ? reloadingState : pendingState });
      if (contextKey) {
        cache.records.set<R>(contextKey, record => ({
          ...record,
          state: isReloading ? STATES.RELOADING : STATES.PENDING
        }));
        cache.promises.set(contextKey, promise);
      }
    },
    [contextKey]
  );

  const handleData = React.useCallback(
    ({ count, record, shouldBroadcast }: { count?: number; record: Record<R>; shouldBroadcast: boolean }) => {
      if (hasMounted.current && (!count || count === counter.current)) {
        // @ts-ignore
        clearDelayTimeout();
        // @ts-ignore
        clearTimeoutTimeout();
        dispatch({
          type: record.state,
          isCached: Boolean(contextKey),
          ...record
        });
        if (contextKey) {
          cache.records.set<R>(contextKey, record, {
            cacheProvider
          });

          const isSuspended = cache.suspenders.get(contextKey);
          cache.suspenders.set(contextKey, typeof isSuspended === 'undefined');

          if (shouldBroadcast) {
            broadcastChanges(contextKey, record);
          }
        }
      }
    },
    [cacheProvider, clearDelayTimeout, clearTimeoutTimeout, contextKey, hasMounted]
  );

  // function handleOptimisticData(
  //   {
  //     data,
  //     optsOrCallback,
  //     callback
  //   }: { data: any; optsOrCallback?: OptimisticOpts<R> | OptimisticCallback; callback?: OptimisticCallback },
  //   state: LoadingState,
  //   count: number
  // ) {
  //   let newData = data;
  //   let opts: OptimisticOpts<R> = {};

  //   if (typeof optsOrCallback === 'object') {
  //     opts = optsOrCallback;
  //   }

  //   if (typeof data === 'function') {
  //     let cachedValue;
  //     if (record.response) {
  //       cachedValue = record.response;
  //     } else if (opts.context) {
  //       cachedValue = cache.records.get(opts.context, { cacheProvider }) || {};
  //     }
  //     newData = data(cachedValue);
  //   }

  //   const value = {
  //     error: state === STATES.REJECTED ? newData : undefined,
  //     response: state === STATES.RESOLVED ? newData : undefined
  //   };
  //   if (!opts.context || contextKey === opts.context) {
  //     handleData(value, state, count);
  //   } else {
  //     const record = { ...value, state };
  //     cache.records.set<R>(opts.context, record, { cacheProvider });
  //   }

  //   let newCallback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;
  //   newCallback && newCallback(newData);
  // }

  const load = React.useCallback(
    (opts?: { fn?: LoadFunction<R> }) => {
      return (..._args: any) => {
        let args = _args.filter((arg: any) => arg.constructor.name !== 'Class');
        if (config.args && (!args || args.length === 0)) {
          args = config.args;
        }

        counter.current = counter.current + 1;
        const count = counter.current;

        if (contextKey) {
          const isSuspended = cache.suspenders.get(contextKey);
          if (suspense && isSuspended) {
            cache.suspenders.set(contextKey, false);
            return;
          }
        }

        let cachedRecord;
        if (contextKey && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
          cachedRecord = cache.records.get<R>(contextKey, { cacheProvider });
          if (cachedRecord) {
            dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
            if (loadPolicy === LOAD_POLICIES.CACHE_FIRST) return;
          }
        }

        const loadFn = opts && opts.fn ? opts.fn : fn;
        const promise = loadFn(
          ...args,
          injectMeta
            ? {
                cachedRecord
                // setResponse: (
                //   data: any,
                //   optsOrCallback: OptimisticOpts<R> | OptimisticCallback,
                //   callback?: OptimisticCallback
                // ) => handleOptimisticData({ data, optsOrCallback, callback }, STATES.RESOLVED, count),
                // setError: (
                //   data: any,
                //   optsOrCallback: OptimisticOpts<R> | OptimisticCallback,
                //   callback?: OptimisticCallback
                // ) => handleOptimisticData({ data, optsOrCallback, callback }, STATES.REJECTED, count)
              }
            : undefined
        );

        const isReloading = count > 1 || cachedRecord;
        if (delay > 0) {
          setDelayTimeout(() => handleLoading({ isReloading, promise }), delay);
        } else {
          handleLoading({ isReloading, promise });
        }
        if (timeout > 0) {
          setTimeoutTimeout(() => handleLoading({ isReloading, isSlow: true, promise }), timeout);
        }

        promise
          .then(response => {
            handleData({
              count,
              record: { error: undefined, response, state: STATES.RESOLVED },
              shouldBroadcast: true
            });
            return response;
          })
          .catch(error => {
            handleData({
              count,
              record: { response: undefined, error, state: STATES.RESOLVED },
              shouldBroadcast: true
            });
            if (throwError && !suspense) {
              throw error;
            }
          });
      };
    },
    [
      cacheProvider,
      config.args,
      contextKey,
      delay,
      fn,
      handleData,
      handleLoading,
      injectMeta,
      loadPolicy,
      setDelayTimeout,
      setTimeoutTimeout,
      suspense,
      throwError,
      timeout
    ]
  );

  const update = React.useMemo(
    () => {
      if (!updateFn) return;
      if (Array.isArray(updateFn)) {
        return updateFn.map(fn => load({ fn }));
      }
      return load({ fn: updateFn });
    },
    [updateFn] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const reset = React.useCallback(() => {
    dispatch({ type: STATES.IDLE });
  }, []);

  React.useEffect(
    () => {
      if (!cachedRecord && contextKey) {
        reset();
      }
    },
    [cachedRecord, contextKey, reset]
  );

  React.useEffect(
    () => {
      if (cachedRecord && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
        dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
      }
    },
    [cachedRecord, loadPolicy, dispatch]
  );

  React.useEffect(
    () => {
      if (defer || (suspense && (!hasRendered.current && !cachedRecord))) return;
      load()();
    },
    [defer, contextKey, suspense, hasRendered, cachedRecord, load]
  );

  React.useEffect(
    () => {
      const updaters = cache.updaters.get(contextKey);
      if (updaters) {
        const newUpdaters = [...updaters, handleData];
        cache.updaters.set(contextKey, newUpdaters);
      } else {
        cache.updaters.set(contextKey, [handleData]);
      }

      return function cleanup() {
        const updaters = cache.updaters.get(contextKey);
        const newUpdaters = updaters.filter((updater: any) => updater !== handleData);
        cache.updaters.set(contextKey, newUpdaters);
      };
    },
    [contextKey, handleData]
  );

  const states = {
    isIdle: record.state === STATES.IDLE && Boolean(!record.response || enableBackgroundStates),
    isPending: record.state === STATES.PENDING && Boolean(!record.response || enableBackgroundStates),
    isPendingSlow: record.state === STATES.PENDING_SLOW && Boolean(!record.response || enableBackgroundStates),
    isResolved: record.state === STATES.RESOLVED || Boolean(record.response),
    isRejected: record.state === STATES.REJECTED,
    isReloading: record.state === STATES.RELOADING,
    isReloadingSlow: record.state === STATES.RELOADING_SLOW
  };

  if (suspense && !defer) {
    if (contextKey) {
      const record = cache.records.get(contextKey);
      const promise = cache.promises.get(contextKey);
      if (record && promise && (states.isPending || states.isPendingSlow)) {
        throw promise;
      }
      if (!record) {
        load()();
      }
    }
  }

  return React.useMemo(
    () => {
      return {
        load: load(),
        update,
        reset,

        response: record.response,
        error: record.error,
        state: record.state,

        ...states,

        isCached: Boolean(record.isCached)
      };
    },
    [record.response, record.error, record.state, record.isCached, states, update] // eslint-disable-line react-hooks/exhaustive-deps
  );
}
