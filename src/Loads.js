import { Component } from 'react';

type Props = {
  children: ({
    state: string,
    error: any,
    response: any,
    hasResponseInCache: boolean,
    cacheTimestamp?: Number,
    isError: boolean,
    isIdle: boolean,
    isLoading: boolean,
    isSuccess: boolean,
    isTimeout: boolean,
    load: (...args: any) => ?Promise<any>,
    resetState: () => void,
    response: any
  }) => any,
  delay?: number,
  error?: any,
  hasResponseInCache?: boolean,
  cacheTimestamp?: Number,
  isErrorSilent?: boolean,
  loadOnMount?: boolean,
  fn: (...args: any) => Promise<any>,
  machineState: { value: string },
  response?: any,
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
    delay: 300,
    timeout: 0,
    isErrorSilent: true,
    loadOnMount: false,
    error: null,
    response: null,
    hasResponseInCache: false,
    cacheTimestamp: undefined
  };
  _delayTimeout: any;
  _timeoutTimeout: any;
  _mounted: boolean;
  _paused: boolean;

  state = {
    error: this.props.error,
    response: this.props.response
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
      this.transition('FETCH');
    }, delay);
    if (timeout) {
      this._timeoutTimeout = setTimeout(() => {
        this.transition('TIMEOUT');
        this._clearTimeouts();
      }, timeout);
    }
  };

  componentDidMount = () => {
    const { loadOnMount, response } = this.props;
    this._mounted = true;

    if (response) {
      this.transition('SUCCESS');
    } else {
      loadOnMount && this.handleLoad();
    }
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
        this.handleResponse({ response, event: 'SUCCESS' });
        return response;
      })
      .catch(err => {
        this.handleResponse({ error: err, event: 'ERROR' });
        if (!isErrorSilent) {
          throw err;
        }
      });
  };

  handleResponse = ({ error, event, response }: { error?: any, event: string, response?: any }) => { // eslint-disable-line
    const { setResponse } = this.props;
    if (!this._mounted) {
      return;
    }
    this._clearTimeouts();
    this._paused = false;
    this.setState({ error, response });
    setResponse && setResponse({ error, response });
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
    const { children, hasResponseInCache, cacheTimestamp, machineState } = this.props;
    const { error, response } = this.state;
    const state = machineState.value;
    const props = {
      state,
      error,
      response,
      hasResponseInCache,
      cacheTimestamp,
      isIdle: state === 'idle',
      isLoading: state === 'loading',
      isTimeout: state === 'timeout',
      isSuccess: state === 'success',
      isError: state === 'error',
      load: this.handleLoad,
      resetState: () => this.transition('RESET')
    };
    return children(props);
  };
}
