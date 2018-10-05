import { Component } from 'react';
import { withStateMachine } from 'react-automata';
import { type LoadPolicy } from './_types';
import statechart, { EVENTS, STATES } from './statechart';
import { LOAD_POLICIES, getCachedResponseFromProps } from './utils';

type Props = {
  enableBackgroundStates?: boolean,
  cachedResponse?: {
    error?: any,
    response?: any,
    state?: ?(STATES.SUCCESS | STATES.ERROR)
  },
  children: ({
    state: string,
    error: any,
    response: any,
    isError: boolean,
    isIdle: boolean,
    isLoading: boolean,
    isSuccess: boolean,
    isTimeout: boolean,
    load: (...args: any) => ?Promise<any>,
    resetState: () => void
  }) => any,
  contextKey?: string,
  delay?: number,
  getCachedResponse?: Function,
  isErrorSilent?: boolean,
  loadOnMount?: boolean,
  loadPolicy?: LoadPolicy,
  fn: (...args: any) => Promise<any>,
  machineState: { value: string },
  setResponse?: (data: { error?: any, response?: any }) => void,
  timeout?: number,
  transition: (state: string) => void
};
type State = {
  contextKey?: string,
  error: any,
  hasResponseInCache: boolean,
  response: any
};

export default withStateMachine(statechart)(
  class Loads extends Component<Props, State> {
    _count: number;
    _delayTimeout: any;
    _timeoutTimeout: any;
    _mounted: boolean;
    _paused: boolean;

    static defaultProps = {
      enableBackgroundStates: false,
      delay: 300,
      timeout: 0,
      error: null,
      isErrorSilent: true,
      loadOnMount: false,
      loadPolicy: LOAD_POLICIES.CACHE_AND_LOAD,
      response: null
    };

    _count = 0;

    state = {
      contextKey: this.props.contextKey,
      ...getCachedResponseFromProps(this.props)
    };

    static getDerivedStateFromProps = (nextProps: Props, state: State) => {
      if (nextProps.contextKey !== state.contextKey) {
        return {
          contextKey: nextProps.contextKey,
          ...getCachedResponseFromProps(nextProps)
        };
      }
      if (nextProps.cachedResponse && !state.hasResponseInCache) {
        return getCachedResponseFromProps(nextProps);
      }
      return {};
    };

    componentDidMount = () => {
      const { loadOnMount } = this.props;
      this._mounted = true;
      if (loadOnMount) {
        this._count = this._count + 1;
        this.handleLoad(this._count)();
      }
    };

    componentDidUpdate = prevProps => {
      const { contextKey: prevContextKey } = prevProps;
      const { contextKey, loadOnMount } = this.props;

      if (contextKey && contextKey !== prevContextKey) {
        if (loadOnMount) {
          this._count = this._count + 1;
          this.handleLoad(this._count)();
        }
      }
    };

    componentWillUnmount = () => {
      this._clearTimeouts();
      this._mounted = false;
    };

    _clearTimeouts = () => {
      clearTimeout(this._delayTimeout);
      clearTimeout(this._timeoutTimeout);
    };

    _setTimeouts = () => {
      const { delay, timeout } = this.props;
      if (delay) this._paused = true;
      this._delayTimeout = setTimeout(() => {
        this._paused = false;
        this.transition(EVENTS.FETCH);
      }, delay);
      if (timeout) {
        this._timeoutTimeout = setTimeout(() => {
          this.transition(EVENTS.TIMEOUT);
          this._clearTimeouts();
        }, timeout);
      }
    };

    handleLoad = (count: ?number) => (...args: any) => {
      const { isErrorSilent, fn, loadPolicy } = this.props;
      const { hasResponseInCache } = this.state;
      if (loadPolicy === LOAD_POLICIES.CACHE_FIRST && hasResponseInCache) return null;
      if (this._paused) return null;
      this._setTimeouts();
      return fn(...args, {
        setError: (opts, cb) =>
          this.handleOptimisticResponse({ ...opts, count, data: opts.error, event: EVENTS.ERROR }, cb),
        setResponse: (opts, cb) => this.handleOptimisticResponse({ ...opts, count, event: EVENTS.SUCCESS }, cb)
      })
        .then(response => {
          this.handleResponse({ count, response, event: EVENTS.SUCCESS });
          return response;
        })
        .catch(err => {
          this.handleResponse({ count, error: err, event: EVENTS.ERROR });
          if (!isErrorSilent) {
            throw err;
          }
        });
    };

    handleResponse = ({
      contextKey,
      count,
      error,
      event,
      response
    }: {
      contextKey?: string,
      count: ?number, // eslint-disable-line
      error?: any, // eslint-disable-line
      event?: EVENTS.SUCCESS | EVENTS.ERROR, // eslint-disable-line
      response?: any // eslint-disable-line
    }) => {
      const { setResponse } = this.props;
      if (!this._mounted) return;
      if (this._count !== count) return;
      const value = {
        ...(event === EVENTS.SUCCESS ? { response } : {}),
        ...(event === EVENTS.ERROR ? { error } : {})
      };
      this._clearTimeouts();
      this._paused = false;
      this.setState(value);
      setResponse &&
        setResponse({
          contextKey,
          ...value,
          ...(event === EVENTS.SUCCESS ? { state: STATES.SUCCESS } : {}),
          ...(event === EVENTS.ERROR ? { state: STATES.ERROR } : {})
        });
      this.transition(event);
    };

    handleOptimisticResponse = ({ contextKey, count, data, event }, cb) => {
      const { contextKey: currentContextKey, getCachedResponse, setResponse } = this.props;

      let newData = data;
      if (typeof data === 'function' && getCachedResponse) {
        const cachedData = getCachedResponse({ contextKey }) || {};
        if (cachedData) {
          newData = data(cachedData.response);
        }
      }

      const value = {
        ...(event === EVENTS.SUCCESS ? { response: newData } : {}),
        ...(event === EVENTS.ERROR ? { error: newData } : {})
      };
      if (!contextKey || contextKey === currentContextKey) {
        this.handleResponse({ contextKey, count, event, ...value });
      } else {
        setResponse &&
          setResponse({
            contextKey,
            ...value,
            ...(event === EVENTS.SUCCESS ? { state: STATES.SUCCESS } : {}),
            ...(event === EVENTS.ERROR ? { state: STATES.ERROR } : {})
          });
      }

      cb && cb(newData);
    };

    transition = (event: string) => {
      const { transition } = this.props;
      if (!this._mounted) {
        return;
      }
      transition(event);
    };

    render = () => {
      const { enableBackgroundStates, cachedResponse, children, machineState } = this.props;
      const { error, hasResponseInCache, response } = this.state;
      const cachedState = cachedResponse ? cachedResponse.state : null;
      const state = machineState.value;
      const props = {
        state,
        error,
        response,
        hasResponseInCache,
        isIdle: state === STATES.IDLE && (!hasResponseInCache || enableBackgroundStates),
        isLoading: state === STATES.LOADING && (!hasResponseInCache || enableBackgroundStates),
        isTimeout: state === STATES.TIMEOUT && (!hasResponseInCache || enableBackgroundStates),
        isSuccess: state === STATES.SUCCESS || (hasResponseInCache && cachedState === STATES.SUCCESS),
        isError: state === STATES.ERROR || (hasResponseInCache && cachedState === STATES.ERROR),
        load: this.handleLoad(this._count),
        resetState: () => this.transition(EVENTS.RESET)
      };
      return children(props);
    };
  }
);
