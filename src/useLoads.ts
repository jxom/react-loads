import * as React from 'react';
// @ts-ignore
import { LRUMap } from 'lru_map';
import useDetectMounted from './hooks/useDetectMounted';
import useTimeout from './hooks/useTimeout';
import StateComponent from './StateComponent';

type Record = { error?: any; response?: any; isCached?: boolean; state: LoadingState };
type LoadsConfig = {
  context?: string;
  delay?: number;
  enableBackgroundStates?: boolean;
  defer?: boolean;
  loadPolicy?: 'cache-first' | 'cache-and-load' | 'load-only';
  timeout?: number;
};
type LoadFunction = (opts?: any) => Promise<any>;
type LoadingState = 'idle' | 'loading' | 'timeout' | 'success' | 'error';

const CACHE_LIMIT = 500;
const STATES: { [key: string]: LoadingState } = {
  IDLE: 'idle',
  LOADING: 'loading',
  TIMEOUT: 'timeout',
  SUCCESS: 'success',
  ERROR: 'error'
};

const cache = new LRUMap<string, Record>(CACHE_LIMIT);

function reducer(state: Record, action: { type: LoadingState; isCached?: boolean; response?: any; error?: any }) {
  switch (action.type) {
    case STATES.IDLE:
      return { state: STATES.IDLE };
    case STATES.LOADING:
      return { ...state, state: STATES.LOADING };
    case STATES.TIMEOUT:
      return { ...state, state: STATES.TIMEOUT };
    case STATES.SUCCESS:
      return { ...state, isCached: action.isCached, response: action.response, state: STATES.SUCCESS };
    case STATES.ERROR:
      return { ...state, isCached: action.isCached, error: action.error, state: STATES.ERROR };
    default:
      return state;
  }
}

export default function useLoads(
  fn: LoadFunction,
  {
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
  const [setDelayTimeout, clearDelayTimeout] = useTimeout(() => dispatch({ type: STATES.LOADING }));
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
        error: state === STATES.ERROR ? data.error : undefined,
        response: state === STATES.SUCCESS ? data.response : undefined
      });
      if (context) {
        const record = { error: data.error, response: data.response, state };
        cache.set(context, record);
      }
    }
  }
  async function load(...args: any) {
    counter.current = counter.current + 1;

    let cachedRecord;
    if (context && loadPolicy !== 'load-only') {
      cachedRecord = cache.get(context);
      if (cachedRecord) {
        dispatch({ type: cachedRecord.state, isCached: true, ...cachedRecord });
        if (loadPolicy === 'cache-first') return;
      }
    }

    if (delay > 0) {
      setDelayTimeout(delay);
    } else {
      dispatch({ type: STATES.LOADING });
    }
    if (timeout > 0) {
      setTimeoutTimeout(timeout);
    }

    try {
      const response = await fn(...args);
      handleData({ response }, STATES.SUCCESS, counter.current);
    } catch (err) {
      handleData({ error: err }, STATES.ERROR, counter.current);
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
    isLoading: record.state === STATES.LOADING && Boolean(!record.isCached || enableBackgroundStates),
    isTimeout: record.state === STATES.TIMEOUT && Boolean(!record.isCached || enableBackgroundStates),
    isSuccess: record.state === STATES.SUCCESS || Boolean(record.isCached && record.response),
    isError: record.state === STATES.ERROR || Boolean(record.isCached && record.error)
  };
  return React.useMemo(
    () => ({
      load,

      response: record.response,
      error: record.error,

      ...renderStates,
      state: record.state,

      Idle: StateComponent(renderStates.isIdle),
      Loading: StateComponent(renderStates.isLoading),
      Timeout: StateComponent(renderStates.isTimeout),
      Success: StateComponent(renderStates.isSuccess),
      Error: StateComponent(renderStates.isError),

      isCached: Boolean(record.isCached)
    }),
    [load, record.response, record.error, record.state, record.isCached]
  );
}
