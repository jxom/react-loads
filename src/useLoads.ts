import * as React from 'react';
import useDetectMounted from './hooks/useDetectMounted';
import useTimeout from './hooks/useTimeout';
import { LOAD_POLICIES, STATES } from './constants';
import StateComponent from './StateComponent';
import { LoadsContext } from './LoadsContext';
import { LoadsConfig, LoadFunction, LoadingState, OptimisticCallback, OptimisticOpts, Record } from './types';

export default function useLoads<R>(fn: LoadFunction<R>, config: LoadsConfig<R> = {}, inputs: Array<any> = []) {
  const {
    cacheProvider,
    delay = 300,
    enableBackgroundStates = false,
    defer = false,
    loadPolicy = LOAD_POLICIES.CACHE_AND_LOAD,
    timeout = 0,
    update: updateFn
  } = config;
  const id = Array.isArray(config.id) ? config.id.join('.') : config.id;
  const contextKey = config.id ? `${config.context}.${id}` : config.context;

  const globalContext = React.useContext(LoadsContext);
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
      case STATES.TIMEOUT:
        return { ...state, state: STATES.TIMEOUT };
      case STATES.RESOLVED:
        return { isCached: action.isCached, error: undefined, response: action.response, state: STATES.RESOLVED };
      case STATES.REJECTED:
        return { isCached: action.isCached, error: action.error, response: undefined, state: STATES.REJECTED };
      default:
        return state;
    }
  }

  const cachedRecord = React.useMemo(
    () => {
      if (contextKey) {
        return globalContext.cache.get(contextKey, { cacheProvider });
      }
      return;
    },
    [cacheProvider, contextKey, globalContext.cache]
  );

  let initialRecord = { state: STATES.IDLE };
  if (cachedRecord && !defer && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
    initialRecord = cachedRecord;
  }
  const [record, dispatch] = React.useReducer(reducer, initialRecord);

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
        globalContext.cache.set(contextKey, record, { cacheProvider });
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
        cachedValue = globalContext.cache.get(opts.context, { cacheProvider }) || {};
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
      if (globalContext.cache) {
        globalContext.cache.set(opts.context, { ...value, state }, { cacheProvider });
      }
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

      counter.current = counter.current + 1;

      if (contextKey && loadPolicy !== LOAD_POLICIES.LOAD_ONLY) {
        if (cachedRecord) {
          dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
          if (loadPolicy === LOAD_POLICIES.CACHE_FIRST) return;
        }
      }

      if (delay > 0) {
        setDelayTimeout(() => dispatch({ type: STATES.PENDING }), delay);
      } else {
        dispatch({ type: STATES.PENDING });
      }
      if (timeout > 0) {
        setTimeoutTimeout(() => dispatch({ type: STATES.TIMEOUT }), timeout);
      }

      const loadFn = opts && opts.fn ? opts.fn : fn;
      return loadFn(...args, {
        cachedRecord,
        setResponse: (
          data: any,
          optsOrCallback: OptimisticOpts<R> | OptimisticCallback,
          callback?: OptimisticCallback
        ) => handleOptimisticData({ data, optsOrCallback, callback }, STATES.RESOLVED, counter.current),
        setError: (data: any, optsOrCallback: OptimisticOpts<R> | OptimisticCallback, callback?: OptimisticCallback) =>
          handleOptimisticData({ data, optsOrCallback, callback }, STATES.REJECTED, counter.current)
      })
        .then(response => {
          handleData({ response }, STATES.RESOLVED, counter.current);
          return response;
        })
        .catch(err => {
          handleData({ error: err }, STATES.REJECTED, counter.current);
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
      if (defer) return;
      load()();
    },
    [defer, contextKey, !inputs ? fn : undefined, ...inputs] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const states = {
    isIdle: record.state === STATES.IDLE && Boolean((!record.response && !record.error) || enableBackgroundStates),
    isPending:
      record.state === STATES.PENDING && Boolean((!record.response && !record.error) || enableBackgroundStates),
    isTimeout:
      record.state === STATES.TIMEOUT && Boolean((!record.response && !record.error) || enableBackgroundStates),
    isResolved: record.state === STATES.RESOLVED || Boolean(record.response),
    isRejected: record.state === STATES.REJECTED || Boolean(record.error)
  };

  return React.useMemo(
    () => ({
      load: load(),
      update,

      response: record.response,
      error: record.error,
      state: record.state,

      ...states,
      Idle: StateComponent(states.isIdle),
      Pending: StateComponent(states.isPending),
      Timeout: StateComponent(states.isTimeout),
      Resolved: StateComponent(states.isResolved),
      Rejected: StateComponent(states.isRejected),

      isCached: Boolean(record.isCached)
    }),
    [record.response, record.error, record.state, record.isCached, states, update] // eslint-disable-line react-hooks/exhaustive-deps
  );
}
