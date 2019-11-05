import * as React from 'react';
import useDetectMounted from './hooks/useDetectMounted';
import useTimeout from './hooks/useTimeout';
import { LOAD_POLICIES, STATES } from './constants';
import { LoadsConfig, LoadFunction, LoadingState, OptimisticCallback, OptimisticOpts, Record } from './types';

import * as cache from './cache';

export default function useLoads<R>(fn: LoadFunction<R>, config: LoadsConfig<R> = {}, inputs: Array<any>) {
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
  const hasMounted = useDetectMounted();
  const [setDelayTimeout, clearDelayTimeout] = useTimeout();
  const [setTimeoutTimeout, clearTimeoutTimeout] = useTimeout();

  function reducer(state: Record<R>, action: { type: LoadingState; isCached?: boolean; response?: R; error?: any }) {
    switch (action.type) {
      case STATES.IDLE:
        return { state: STATES.IDLE };
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

  const cachedRecord = React.useMemo(
    () => {
      if (contextKey) {
        return cache.records.get<R>(contextKey, { cacheProvider });
      }
      return;
    },
    [cacheProvider, contextKey]
  );

  let initialRecord = { state: STATES.IDLE };
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
          state: isReloading ? STATES.RELOADING : STATES.PENDING,
          promise: isReloading ? undefined : promise
        }));
      }
    },
    [contextKey]
  );

  function handleData(data: { response?: R; error?: any }, state: LoadingState, count: number) {
    if (hasMounted.current && count === counter.current) {
      // @ts-ignore
      clearDelayTimeout();
      // @ts-ignore
      clearTimeoutTimeout();
      dispatch({
        type: state,
        isCached: Boolean(contextKey),
        error: state === STATES.REJECTED ? data.error : undefined,
        response: state === STATES.RESOLVED ? data.response : undefined
      });
      if (contextKey) {
        const record = { error: data.error, response: data.response, state };
        cache.records.set<R>(contextKey, record, { cacheProvider });
      }
    }
  }

  function handleOptimisticData(
    {
      data,
      optsOrCallback,
      callback
    }: { data: any; optsOrCallback?: OptimisticOpts<R> | OptimisticCallback; callback?: OptimisticCallback },
    state: LoadingState,
    count: number
  ) {
    let newData = data;
    let opts: OptimisticOpts<R> = {};

    if (typeof optsOrCallback === 'object') {
      opts = optsOrCallback;
    }

    if (typeof data === 'function') {
      let cachedValue;
      if (record.response) {
        cachedValue = record.response;
      } else if (opts.context) {
        cachedValue = cache.records.get(opts.context, { cacheProvider }) || {};
      }
      newData = data(cachedValue);
    }

    const value = {
      error: state === STATES.REJECTED ? newData : undefined,
      response: state === STATES.RESOLVED ? newData : undefined
    };
    if (!opts.context || contextKey === opts.context) {
      handleData(value, state, count);
    } else {
      const record = { ...value, state };
      cache.records.set<R>(opts.context, prevRecord => ({ ...record, promise: prevRecord.promise }), { cacheProvider });
    }

    let newCallback = typeof optsOrCallback === 'function' ? optsOrCallback : callback;
    newCallback && newCallback(newData);
  }

  function load(opts?: { fn?: LoadFunction<R> }) {
    return (..._args: any) => {
      let args = _args.filter((arg: any) => arg.constructor.name !== 'Class');
      if (config.args && (!args || args.length === 0)) {
        args = config.args;
      }

      if (!hasMounted.current) return;

      counter.current = counter.current + 1;
      const count = counter.current;

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
              cachedRecord,
              setResponse: (
                data: any,
                optsOrCallback: OptimisticOpts<R> | OptimisticCallback,
                callback?: OptimisticCallback
              ) => handleOptimisticData({ data, optsOrCallback, callback }, STATES.RESOLVED, count),
              setError: (
                data: any,
                optsOrCallback: OptimisticOpts<R> | OptimisticCallback,
                callback?: OptimisticCallback
              ) => handleOptimisticData({ data, optsOrCallback, callback }, STATES.REJECTED, count)
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
          handleData({ response }, STATES.RESOLVED, count);
          return response;
        })
        .catch(err => {
          handleData({ error: err }, STATES.REJECTED, count);
          if (throwError && !suspense) {
            throw err;
          }
        });
    };
  }

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
    [cachedRecord, contextKey] // eslint-disable-line react-hooks/exhaustive-deps
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
      if (defer || (suspense && !cachedRecord)) return;
      load()();
    },
    [defer, contextKey, suspense, !inputs ? fn : undefined, ...(inputs || [])] // eslint-disable-line react-hooks/exhaustive-deps
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
      if (record && record.promise) {
        throw record.promise;
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
