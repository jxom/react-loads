import * as React from 'react';

import { Context as LoadsConfigContext } from './LoadsConfig';
import * as cache from './cache';
import { LOAD_POLICIES, STATES } from './constants';
import useDetectMounted from './hooks/useDetectMounted';
import useInterval from './hooks/useInterval';
import usePrevious from './hooks/usePrevious';
import useTimeout from './hooks/useTimeout';
import * as utils from './utils';
import {
  ContextArg,
  ConfigArg,
  FnArg,
  LoadFunction,
  LoadingState,
  OptimisticCallback,
  Record,
  OptimisticContext
} from './types';

function broadcastChanges<Response, Err>(cacheKey: string, record: Record<Response, Err>) {
  const updaters = cache.updaters.get(cacheKey);
  if (updaters) {
    updaters.forEach((updater: any) => updater({ record, shouldBroadcast: false }));
  }
}

const IDLE_RECORD = { error: undefined, response: undefined, state: STATES.IDLE };

export function useLoads<Response, Err>(
  context: ContextArg | null,
  fn: FnArg<Response>,
  localConfig?: ConfigArg<Response, Err>
) {
  const globalConfig = React.useContext(LoadsConfigContext);
  const config = { ...globalConfig, ...(localConfig || {}) };
  const {
    cacheProvider,
    cacheStrategy,
    cacheTime,
    dedupingInterval,
    dedupeManualLoad,
    delay,
    initialResponse: _initialResponse,
    loadPolicy,
    onReject,
    onResolve,
    pollingInterval,
    pollWhile,
    pollWhenHidden,
    rejectRetryInterval,
    revalidateOnWindowFocus,
    revalidateTime,
    suspense,
    throwError,
    timeout,
    update: updateFn
  } = config;

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

  const variablesHash = React.useMemo(() => JSON.stringify(variables), [variables]);
  const cacheKey = utils.getCacheKey({ context, variablesHash, cacheStrategy });

  const counter = React.useRef<number>(0);
  const prevCacheKey = usePrevious(cacheKey);
  const isSameContext = !prevCacheKey || prevCacheKey === cacheKey;
  const prevVariablesHash = usePrevious(JSON.stringify(variables));
  const isSameVariables = variablesHash === prevVariablesHash;
  const [hasMounted, hasRendered] = useDetectMounted();
  const [setDelayTimeout, clearDelayTimeout] = useTimeout();
  const [setErrorRetryTimeout] = useTimeout();
  const [setTimeoutTimeout, clearTimeoutTimeout] = useTimeout();

  const cachedRecord = React.useMemo(
    () => {
      if (cacheKey && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
        return cache.records.get<Response, Err>(cacheKey, { cacheProvider });
      }
      return;
    },
    [cacheProvider, cacheKey, loadPolicy]
  );

  const initialResponse = React.useMemo(() => _initialResponse, []); // eslint-disable-line
  let initialRecord: Record<Response, Err> = initialResponse
    ? { response: initialResponse, error: undefined, state: STATES.RESOLVED }
    : { ...IDLE_RECORD, state: defer ? STATES.IDLE : STATES.PENDING };
  if (cachedRecord && !defer) {
    initialRecord = cachedRecord;
  }

  const reducer = React.useCallback(
    (
      state: Record<Response, Err>,
      action: { type: LoadingState; isCached?: boolean; response?: Response; error?: Err }
    ): Record<Response, Err> => {
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
    },
    []
  );
  const [record, dispatch] = React.useReducer(reducer, initialRecord);

  const handleLoading = React.useCallback(
    ({ isReloading, isSlow, promise }) => {
      const reloadingState = isSlow ? STATES.RELOADING_SLOW : STATES.RELOADING;
      const pendingState = isSlow ? STATES.PENDING_SLOW : STATES.PENDING;
      dispatch({ type: isReloading ? reloadingState : pendingState });
      if (cacheKey) {
        cache.records.set<Response, Err>(
          cacheKey,
          record => ({
            ...record,
            state: isReloading ? STATES.RELOADING : STATES.PENDING
          }),
          { cacheTime, cacheProvider }
        );
        if (!isReloading) {
          cache.promises.set(cacheKey, promise);
        }
      }
    },
    [cacheProvider, cacheTime, cacheKey]
  );

  const handleData = React.useCallback(
    ({
      count,
      record,
      shouldBroadcast
    }: {
      count?: number;
      record: Record<Response, Err>;
      shouldBroadcast: boolean;
    }) => {
      if (hasMounted.current && (!count || count === counter.current)) {
        // @ts-ignore
        clearDelayTimeout();
        // @ts-ignore
        clearTimeoutTimeout();
        dispatch({
          type: record.state,
          isCached: Boolean(cacheKey),
          ...record
        });
        if (cacheKey) {
          cache.records.set<Response, Err>(cacheKey, record, {
            cacheProvider,
            cacheTime
          });

          const isSuspended = cache.suspenders.get(cacheKey);
          cache.suspenders.set(cacheKey, typeof isSuspended === 'undefined');

          cache.promises.delete(cacheKey);

          if (shouldBroadcast) {
            broadcastChanges(cacheKey, record);
          }
        }
      }
    },
    [cacheProvider, cacheTime, clearDelayTimeout, clearTimeoutTimeout, cacheKey, hasMounted]
  );

  const handleOptimisticData = React.useCallback(
    (
      {
        data,
        contextOrCallback,
        callback
      }: {
        data: any;
        contextOrCallback?: OptimisticContext | OptimisticCallback;
        callback?: OptimisticCallback;
      },
      state: LoadingState,
      count: number
    ) => {
      let newData = data;

      let optimisticCacheKey = cacheKey;
      if (typeof contextOrCallback === 'object') {
        const variablesHash = JSON.stringify(contextOrCallback.variables);
        optimisticCacheKey = utils.getCacheKey({ context: contextOrCallback.context, variablesHash, cacheStrategy });
      }

      if (typeof data === 'function') {
        let cachedValue = IDLE_RECORD;
        if (optimisticCacheKey) {
          cachedValue = cache.records.get(optimisticCacheKey, { cacheProvider }) || IDLE_RECORD;
        }
        newData = data(state === STATES.RESOLVED ? cachedValue.response : cachedValue.error);
      }

      const newRecord = {
        error: state === STATES.REJECTED ? newData : undefined,
        response: state === STATES.RESOLVED ? newData : undefined,
        state
      };
      if (!optimisticCacheKey || cacheKey === optimisticCacheKey) {
        handleData({ count, record: newRecord, shouldBroadcast: true });
      } else {
        cache.records.set<Response, Err>(optimisticCacheKey, newRecord, { cacheProvider, cacheTime });
      }

      let newCallback = typeof contextOrCallback === 'function' ? contextOrCallback : callback;
      newCallback && newCallback(newData);
    },
    [cacheStrategy, cacheKey, cacheProvider, handleData, cacheTime]
  );

  const load = React.useCallback(
    (opts: { isManualInvoke?: boolean; fn?: LoadFunction<Response> } = {}) => {
      return (..._args: any) => {
        if (!opts.isManualInvoke && variables && isSameVariables) {
          return;
        }

        // Build cacheKey based of these args?
        let args = _args.filter((arg: any) => arg.constructor.name !== 'Class');
        if (variables && (!args || args.length === 0)) {
          args = variables;
        }

        let cachedRecord;
        if (cacheKey) {
          cachedRecord = cache.records.get<Response, Err>(cacheKey, { cacheProvider });
        }

        if (cachedRecord) {
          const isDuplicate =
            // @ts-ignore
            Math.abs(new Date() - cachedRecord.updated) < dedupingInterval &&
            (!opts.isManualInvoke || dedupeManualLoad);
          if (isDuplicate) return;
        }

        counter.current = counter.current + 1;
        const count = counter.current;

        if (cacheKey) {
          const isSuspended = cache.suspenders.get(cacheKey);
          if (suspense && isSuspended) {
            cache.suspenders.set(cacheKey, false);
            return;
          }
        }

        if (cacheKey && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
          if (!defer && cachedRecord) {
            dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });

            if (cachedRecord.state === STATES.RESOLVED || cachedRecord.state === STATES.REJECTED) {
              // @ts-ignore
              const isStale = Math.abs(new Date() - cachedRecord.updated) >= revalidateTime;
              const isCachedWithCacheFirst =
                !isStale && !opts.isManualInvoke && loadPolicy === LOAD_POLICIES.CACHE_FIRST;
              if (isCachedWithCacheFirst) return;
            }
          }
        }

        const loadFn = opts.fn ? opts.fn : fn;
        const promiseOrFn = loadFn(...args);

        let promise = promiseOrFn;
        if (typeof promiseOrFn === 'function') {
          promise = promiseOrFn({
            cachedRecord,
            setResponse: (
              data: any,
              contextOrCallback: OptimisticContext | OptimisticCallback,
              callback?: OptimisticCallback
            ) => handleOptimisticData({ data, contextOrCallback, callback }, STATES.RESOLVED, count),
            setError: (
              data: any,
              contextOrCallback: OptimisticContext | OptimisticCallback,
              callback?: OptimisticCallback
            ) => handleOptimisticData({ data, contextOrCallback, callback }, STATES.REJECTED, count)
          });
        }

        const isReloading = context && isSameContext && (count > 1 || (cachedRecord && !defer) || initialResponse);
        if (delay > 0) {
          setDelayTimeout(() => handleLoading({ isReloading, promise }), delay);
        } else {
          handleLoading({ isReloading, promise });
        }
        if (timeout > 0) {
          setTimeoutTimeout(() => handleLoading({ isReloading, isSlow: true, promise }), timeout);
        }

        if (typeof promise === 'function') return;
        return promise
          .then(response => {
            handleData({
              count,
              record: { error: undefined, response, state: STATES.RESOLVED },
              shouldBroadcast: true
            });

            onResolve && onResolve(response);

            return response;
          })
          .catch(error => {
            handleData({
              count,
              record: { response: undefined, error, state: STATES.REJECTED },
              shouldBroadcast: false
            });

            onReject && onReject(error);

            if (rejectRetryInterval) {
              const count = Math.min(counter.current || 0, 8);
              const timeout =
                typeof rejectRetryInterval === 'function'
                  ? rejectRetryInterval(count)
                  : ~~((Math.random() + 0.5) * (1 << count)) * rejectRetryInterval;
              setErrorRetryTimeout(() => load()(args), timeout);
            }

            if (throwError && !suspense) {
              throw error;
            }
          });
      };
    },
    [
      variablesHash,
      isSameVariables,
      cacheKey,
      loadPolicy,
      fn,
      context,
      isSameContext,
      defer,
      initialResponse,
      delay,
      timeout,
      cacheProvider,
      dedupingInterval,
      dedupeManualLoad,
      suspense,
      revalidateTime,
      handleOptimisticData,
      setDelayTimeout,
      handleLoading,
      setTimeoutTimeout,
      handleData,
      onResolve,
      onReject,
      rejectRetryInterval,
      throwError,
      setErrorRetryTimeout
    ]
  );

  const update = React.useMemo(
    () => {
      if (!updateFn) return;
      if (Array.isArray(updateFn)) {
        return updateFn.map(fn => load({ fn, isManualInvoke: true }));
      }
      return load({ fn: updateFn, isManualInvoke: true });
    },
    [load, updateFn]
  );

  const reset = React.useCallback(() => {
    dispatch({ type: STATES.IDLE });
  }, []);

  React.useEffect(
    () => {
      if (!cachedRecord && cacheKey && !initialResponse) {
        reset();
      }
    },
    [cachedRecord, cacheKey, initialResponse, reset]
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
      if (defer || (suspense && (!hasRendered.current && !cachedRecord)) || loadPolicy === LOAD_POLICIES.CACHE_ONLY)
        return;
      load()();
    },
    [defer, cacheKey, suspense, hasRendered, cachedRecord, load, loadPolicy]
  );

  React.useEffect(
    () => {
      if (defer) return;

      const updaters = cache.updaters.get(cacheKey);
      if (updaters) {
        const newUpdaters = [...updaters, handleData];
        cache.updaters.set(cacheKey, newUpdaters);
      } else {
        cache.updaters.set(cacheKey, [handleData]);
      }

      return function cleanup() {
        const updaters = cache.updaters.get(cacheKey);
        const newUpdaters = updaters.filter((updater: any) => updater !== handleData);
        cache.updaters.set(cacheKey, newUpdaters);
      };
    },
    [cacheKey, defer, handleData]
  );

  React.useEffect(
    () => {
      if (!revalidateOnWindowFocus || defer) return;

      const revalidate = load();
      cache.revalidators.set(cacheKey, revalidate);

      return function cleanup() {
        cache.revalidators.delete(cacheKey);
      };
    },
    [cacheKey, defer, handleData, load, revalidateOnWindowFocus]
  );

  let shouldPoll = !defer;
  if (shouldPoll && pollWhile) {
    if (typeof pollWhile === 'function') {
      shouldPoll = pollWhile(record);
    } else {
      shouldPoll = pollWhile;
    }
  }
  useInterval(() => {
    if (!utils.isDocumentVisible() && !pollWhenHidden) return;
    load({ isManualInvoke: true })();
  }, shouldPoll ? pollingInterval : undefined);

  const states = React.useMemo(
    () => ({
      isIdle: record.state === STATES.IDLE && Boolean(!record.response),
      isPending: record.state === STATES.PENDING || record.state === STATES.PENDING_SLOW,
      isPendingSlow: record.state === STATES.PENDING_SLOW,
      isResolved: record.state === STATES.RESOLVED || Boolean(record.response),
      isRejected: record.state === STATES.REJECTED,
      isReloading: record.state === STATES.RELOADING || record.state === STATES.RELOADING_SLOW,
      isReloadingSlow: record.state === STATES.RELOADING_SLOW
    }),
    [record.response, record.state]
  );

  if (suspense && !defer) {
    if (cacheKey) {
      const record = cache.records.get(cacheKey);
      const promise = cache.promises.get(cacheKey);
      if (record && promise) {
        throw promise;
      }
      if (!record) {
        load()();
      }
    }
    if (states.isRejected) {
      throw record.error;
    }
  }

  return React.useMemo(
    () => {
      return {
        load: load({ isManualInvoke: true }),
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

let eventsBinded = false;
if (typeof window !== 'undefined' && window.addEventListener && !eventsBinded) {
  const revalidate = () => {
    if (!utils.isDocumentVisible() || !utils.isOnline()) return;
    cache.revalidators.forEach(revalidator => revalidator && revalidator());
  };
  window.addEventListener('visibilitychange', revalidate, false);
  window.addEventListener('focus', revalidate, false);
  eventsBinded = true;
}
