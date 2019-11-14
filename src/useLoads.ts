import * as React from 'react';

import * as cache from './cache';
import { LOAD_POLICIES, STATES } from './constants';
import useDetectMounted from './hooks/useDetectMounted';
import usePrevious from './hooks/usePrevious';
import useTimeout from './hooks/useTimeout';
import { LoadsConfig, LoadFunction, LoadingState, OptimisticCallback, OptimisticOpts, Record } from './types';

function broadcastChanges<R>(contextKey: string, record: Record<R>) {
  const updaters = cache.updaters.get(contextKey);
  if (updaters) {
    updaters.forEach((updater: any) => updater({ record, shouldBroadcast: false }));
  }
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

export default function useLoads<R>(
  context: string | Array<string>,
  fn: LoadFunction<R> | ((args?: any) => LoadFunction<R>),
  config: LoadsConfig<R> = {}
) {
  const {
    cacheProvider,
    delay,
    enableBackgroundStates,
    loadPolicy,
    suspense,
    throwError,
    timeout,
    update: updateFn
  } = { ...cache.globalConfig, ...config };

  let defer = config.defer;
  let variables = config.variables;
  if (typeof variables === 'function') {
    try {
      variables = variables();
      defer = config.defer;
    } catch (err) {
      defer = true;
    }
  }

  let contextKey = Array.isArray(context) ? context.join('.') : context;
  const variablesHash = React.useMemo(() => JSON.stringify(variables), [variables]);
  if (variablesHash) {
    contextKey = `${contextKey}.${variablesHash}`;
  }

  const counter = React.useRef<number>(0);
  const prevContextKey = usePrevious(contextKey);
  const isSameContext = !prevContextKey || prevContextKey === contextKey;
  const prevVariablesHash = usePrevious(JSON.stringify(variables));
  const isSameVariables = variablesHash === prevVariablesHash;
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

  const handleOptimisticData = React.useCallback(
    (
      {
        data,
        contextOrCallback,
        callback
      }: { data: any; contextOrCallback?: string | OptimisticCallback; callback?: OptimisticCallback },
      state: LoadingState,
      count: number
    ) => {
      let newData = data;

      let context;
      if (typeof contextOrCallback === 'string') {
        context = contextOrCallback;
      }

      if (typeof data === 'function') {
        let cachedValue = IDLE_RECORD;
        if (context) {
          cachedValue = cache.records.get(context, { cacheProvider }) || IDLE_RECORD;
        }
        newData = data(state === STATES.RESOLVED ? cachedValue.response : cachedValue.error);
      }

      const newRecord = {
        error: state === STATES.REJECTED ? newData : undefined,
        response: state === STATES.RESOLVED ? newData : undefined,
        state
      };
      if (!context || contextKey === context) {
        handleData({ count, record: newRecord, shouldBroadcast: true });
      } else {
        cache.records.set<R>(context, newRecord, { cacheProvider });
      }

      let newCallback = typeof contextOrCallback === 'function' ? contextOrCallback : callback;
      newCallback && newCallback(newData);
    },
    [cacheProvider, contextKey, handleData]
  );

  const load = React.useCallback(
    (opts: { skipVariableCheck?: boolean; fn?: LoadFunction<R> } = {}) => {
      return (..._args: any) => {
        if (!opts.skipVariableCheck && variables && isSameVariables) {
          return;
        }

        let args = _args.filter((arg: any) => arg.constructor.name !== 'Class');
        if (variables && (!args || args.length === 0)) {
          args = variables;
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
        if (contextKey && !defer && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
          cachedRecord = cache.records.get<R>(contextKey, { cacheProvider });
          if (cachedRecord) {
            dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
            if (loadPolicy === LOAD_POLICIES.CACHE_FIRST) return;
          }
        }

        const loadFn = opts.fn ? opts.fn : fn;
        const promiseOrFn = loadFn(...args);

        let promise = promiseOrFn;
        if (typeof promiseOrFn === 'function') {
          promise = promiseOrFn({
            cachedRecord,
            setResponse: (data: any, contextOrCallback: string | OptimisticCallback, callback?: OptimisticCallback) =>
              handleOptimisticData({ data, contextOrCallback, callback }, STATES.RESOLVED, count),
            setError: (data: any, contextOrCallback: string | OptimisticCallback, callback?: OptimisticCallback) =>
              handleOptimisticData({ data, contextOrCallback, callback }, STATES.REJECTED, count)
          });
        }

        const isReloading = isSameContext && (count > 1 || cachedRecord);
        if (delay > 0) {
          setDelayTimeout(() => handleLoading({ isReloading, promise }), delay);
        } else {
          handleLoading({ isReloading, promise });
        }
        if (timeout > 0) {
          setTimeoutTimeout(() => handleLoading({ isReloading, isSlow: true, promise }), timeout);
        }

        if (typeof promise === 'function') return;
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
      contextKey,
      defer,
      delay,
      fn,
      handleData,
      handleLoading,
      handleOptimisticData,
      isSameContext,
      isSameVariables,
      loadPolicy,
      setDelayTimeout,
      setTimeoutTimeout,
      suspense,
      throwError,
      timeout,
      variables
    ]
  );

  const update = React.useMemo(
    () => {
      if (!updateFn) return;
      if (Array.isArray(updateFn)) {
        return updateFn.map(fn => load({ fn, skipVariableCheck: true }));
      }
      return load({ fn: updateFn, skipVariableCheck: true });
    },
    [load, updateFn]
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
      if (cachedRecord && !defer && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
        dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
      }
    },
    [cachedRecord, loadPolicy, dispatch, defer]
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
    isPending:
      (record.state === STATES.PENDING || record.state === STATES.PENDING_SLOW) &&
      Boolean(!record.response || enableBackgroundStates),
    isPendingSlow: record.state === STATES.PENDING_SLOW && Boolean(!record.response || enableBackgroundStates),
    isResolved: record.state === STATES.RESOLVED || Boolean(record.response),
    isRejected: record.state === STATES.REJECTED,
    isReloading: record.state === STATES.RELOADING || record.state === STATES.RELOADING_SLOW,
    isReloadingSlow: record.state === STATES.RELOADING_SLOW
  };

  if (suspense && !defer) {
    if (contextKey) {
      const record = cache.records.get(contextKey);
      const promise = cache.promises.get(contextKey);
      if (record && promise && states.isPending) {
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
        load: load({ skipVariableCheck: true }),
        update,
        reset,

        response: record.response,
        error: record.error,
        state: record.state,

        ...states,

        isCached: Boolean(record.isCached)
      };
    },
    [load, update, reset, record.response, record.error, record.state, record.isCached, states]
  );
}
