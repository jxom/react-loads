import { Component } from 'react';
import idx from 'idx';
import { EVENTS, STATES } from './statechart';

type Props = {
  enableBackgroundStates?: boolean,
  cache?: {
    error?: any,
    response?: any,
    state?: ?(STATES.SUCCESS | STATES.ERROR)
  },
  children: ({
    error: any,
    isError: boolean,
    isIdle: boolean,
    isLoading: boolean,
    isSuccess: boolean,
    isTimeout: boolean,
    load: (...args: any) => ?Promise<any>,
    resetState: () => void,
    response: any,
    state: string
  }) => any,
  delay?: number,
  isErrorSilent?: boolean,
  loadOnMount?: boolean,
  fn: (...args: any) => Promise<any>,
  machineState: { value: string },
  setResponse?: (data: { error?: any, response?: any }) => void,
  timeout?: number,
  transition: (state: string) => void
};
type State = {
  error: any,
  response: any
};

export default class Loads extends Component<Props, State> {
  static defaultProps = {
    enableBackgroundStates: false,
    delay: 300,
    error: null,
    isErrorSilent: true,
    loadOnMount: false,
    response: null,
    timeout: 0
  };
  _delayTimeout: any;
  _timeoutTimeout: any;
  _mounted: boolean;
  _paused: boolean;

  state = {
    error: idx(this.props, _ => _.cache.error),
    response: idx(this.props, _ => _.cache.response)
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

  componentDidMount = () => {
    const { loadOnMount } = this.props;
    this._mounted = true;
    loadOnMount && this.handleLoad();
  };

  componentWillUnmount = () => {
    this._clearTimeouts();
    this._mounted = false;
  };

  handleLoad = (...args: any) => {
    const { isErrorSilent, fn } = this.props;
    if (this._paused) return null;
    this._setTimeouts();
    return fn(...args)
      .then(response => {
        this.handleResponse({ response, event: EVENTS.SUCCESS });
        return response;
      })
      .catch(err => {
        this.handleResponse({ error: err, event: EVENTS.ERROR });
        if (!isErrorSilent) {
          throw err;
        }
      });
  };

  handleResponse = ({ error, event, response }: { error?: any, event: EVENTS.SUCCESS | EVENTS.ERROR, response?: any }) => { // eslint-disable-line
    const { setResponse } = this.props;
    if (!this._mounted) {
      return;
    }
    const value = {
      ...(event === EVENTS.SUCCESS ? { response } : {}),
      ...(event === EVENTS.ERROR ? { error } : {})
    };
    this._clearTimeouts();
    this._paused = false;
    this.setState(value);
    setResponse &&
      setResponse({
        ...value,
        ...(event === EVENTS.SUCCESS ? { state: STATES.SUCCESS } : {}),
        ...(event === EVENTS.ERROR ? { state: STATES.ERROR } : {})
      });
    this.transition(event);
  };

  transition = (event: string) => {
    const { transition } = this.props;
    if (!this._mounted) {
      return;
    }
    transition(event);
  };

  render = () => {
    const { enableBackgroundStates, cache, children, machineState } = this.props;
    const { error, response } = this.state;
    const cachedState = cache ? cache.state : null;
    const hasResponseInCache = typeof cache !== 'undefined';
    const state = machineState.value;
    const props = {
      error,
      hasResponseInCache,
      isIdle: state === STATES.IDLE && (!hasResponseInCache || enableBackgroundStates),
      isLoading: state === STATES.LOADING && (!hasResponseInCache || enableBackgroundStates),
      isTimeout: state === STATES.TIMEOUT && (!hasResponseInCache || enableBackgroundStates),
      isSuccess: state === STATES.SUCCESS || (hasResponseInCache && cachedState === STATES.SUCCESS),
      isError: state === STATES.ERROR || (hasResponseInCache && cachedState === STATES.ERROR),
      load: this.handleLoad,
      resetState: () => this.transition(EVENTS.RESET),
      response,
      state
    };
    return children(props);
  };
}
