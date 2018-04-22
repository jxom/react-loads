// @flow

import { createElement, Component } from 'react';
import { withStatechart } from 'react-automata';
export * from './states';

const statechart = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    loading: {
      on: {
        TIMEOUT: 'timeout',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    timeout: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    error: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    }
  }
};

type Props = {
  children: ({ response?: any, error?: any, load?: () => ?Promise<void> }) => any,
  delay?: number,
  isErrorSilent?: boolean,
  loadOnMount?: boolean,
  fn: (...args: any) => Promise<any>,
  machineState: { value: string },
  timeout?: number,
  transition: (state: string) => void
};
type State = {
  error: any,
  response: any
};

class Loads extends Component<Props, State> {
  static defaultProps = {
    delay: 300,
    isErrorSilent: true,
    loadOnMount: false,
    timeout: 0
  };
  _delayTimeout: any;
  _timeoutTimeout: any;
  _mounted: boolean;
  _paused: boolean;

  state = {
    error: null,
    response: null
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
    if (!this._mounted) {
      return;
    }
    this._clearTimeouts();
    this._paused = false;
    this.setState({ error, response });
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
    const { children, machineState } = this.props;
    const { error, response } = this.state;
    const state = machineState.value;
    return children({
      error,
      response,
      state,
      load: this.handleLoad
    });
  };
}

const _default = ({ channel, ...props }: { channel?: ?string }) =>
  createElement(withStatechart(statechart, { channel })(Loads), props);

_default.defaultProps = { channel: null };

export default _default;
