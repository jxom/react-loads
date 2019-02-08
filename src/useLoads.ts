import * as React from 'react';
import useDetectMounted from './hooks/useDetectMounted';
import useTimeout from './hooks/useTimeout';
import StateComponent from './StateComponent';
import cache from './cache';
import { LoadsConfig, LoadFunction, LoadingState, Record } from './types';

const STATES: { [key: string]: LoadingState } = {
  IDLE: 'idle',
  PENDING: 'pending',
  TIMEOUT: 'timeout',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

function reducer(state: Record, action: { type: LoadingState; isCached?: boolean; response?: any; error?: any }) {
  switch (action.type) {
    case STATES.IDLE:
      return { state: STATES.IDLE };
    case STATES.PENDING:
      return { ...state, state: STATES.PENDING };
    case STATES.TIMEOUT:
      return { ...state, state: STATES.TIMEOUT };
    case STATES.RESOLVED:
      return { ...state, isCached: action.isCached, response: action.response, state: STATES.RESOLVED };
    case STATES.REJECTED:
      return { ...state, isCached: action.isCached, error: action.error, state: STATES.REJECTED };
    default:
      return state;
  }
}

export default function useLoads(
  fn: LoadFunction,
  {
    cacheProvider,
    context,
    delay = 300,
    enableBackgroundStates = false,
    defer = false,
    loadPolicy = 'cache-and-load',
    timeout = 0
  }: LoadsConfig = {},
  inputs = []
) {
  const counter = React.useRef<number>(0);
  const hasMounted = useDetectMounted();
  const [record, dispatch] = React.useReducer(reducer, { state: STATES.IDLE });
  const [setDelayTimeout, clearDelayTimeout] = useTimeout(() => dispatch({ type: STATES.PENDING }));
  const [setTimeoutTimeout, clearTimeoutTimeout] = useTimeout(() => dispatch({ type: STATES.TIMEOUT }));

  function handleData(data: { response?: any; error?: any }, state: LoadingState, count: number) {
    if (hasMounted.current && count === counter.current) {
      // @ts-ignore
      clearDelayTimeout();
      // @ts-ignore
      clearTimeoutTimeout();
      dispatch({
        type: state,
        isCached: Boolean(context),
        error: state === STATES.REJECTED ? data.error : undefined,
        response: state === STATES.RESOLVED ? data.response : undefined
      });
      if (context) {
        const record = { error: data.error, response: data.response, state };
        cache.set(context, record, { cacheProvider });
      }
    }
  }
  async function load(...args: any) {
    counter.current = counter.current + 1;

    let cachedRecord;
    if (context && loadPolicy !== 'load-only') {
      cachedRecord = cache.get(context, { cacheProvider });
      if (cachedRecord) {
        dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
        if (loadPolicy === 'cache-first') return;
      }
    }

    if (delay > 0) {
      setDelayTimeout(delay);
    } else {
      dispatch({ type: STATES.PENDING });
    }
    if (timeout > 0) {
      setTimeoutTimeout(timeout);
    }

    try {
      const response = await fn(...args);
      handleData({ response }, STATES.RESOLVED, counter.current);
    } catch (err) {
      handleData({ error: err }, STATES.REJECTED, counter.current);
    }
  }

  React.useEffect(
    () => {
      if (defer) return;
      load();
    },
    [defer, context, ...inputs]
  );

  const renderStates = {
    isIdle: record.state === STATES.IDLE && Boolean(!record.isCached || enableBackgroundStates),
    isPending: record.state === STATES.PENDING && Boolean(!record.isCached || enableBackgroundStates),
    isTimeout: record.state === STATES.TIMEOUT && Boolean(!record.isCached || enableBackgroundStates),
    isResolved: record.state === STATES.RESOLVED || Boolean(record.isCached && record.response),
    isRejected: record.state === STATES.REJECTED || Boolean(record.isCached && record.error)
  };
  return React.useMemo(
    () => ({
      load,

      response: record.response,
      error: record.error,

      ...renderStates,
      state: record.state,

      Idle: StateComponent(renderStates.isIdle),
      Pending: StateComponent(renderStates.isPending),
      Timeout: StateComponent(renderStates.isTimeout),
      Resolved: StateComponent(renderStates.isResolved),
      Rejected: StateComponent(renderStates.isRejected),

      isCached: Boolean(record.isCached)
    }),
    [load, record.response, record.error, record.state, record.isCached]
  );
}
