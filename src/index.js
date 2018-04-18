// @flow

import React, { Component, createElement } from 'react';
import { Action as AutomataAction, withStatechart } from 'react-automata';
export { Action } from 'react-automata';

const statechart = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      },
      onEntry: 'idle'
    },
    loading: {
      on: {
        SUCCESS: 'success',
        ERROR: 'error',
        TIMEOUT: 'timeout'
      },
      onEntry: 'loading'
    },
    timeout: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      },
      onEntry: 'timeout'
    },
    success: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      },
      onEntry: 'success'
    },
    error: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      },
      onEntry: 'error'
    }
  }
};

type Props = {
  children: ({ response?: any, error?: any, load?: () => Promise<void> }) => any,
  delay?: number,
  isErrorSilent?: boolean,
  loadOnMount?: boolean,
  name?: string,
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
    name: null,
    timeout: 0
  };
  _delayTimeout: any;
  _timeoutTimeout: any;

  state = {
    error: null,
    response: null
  };

  _clearTimeouts = () => {
    clearTimeout(this._delayTimeout);
    clearTimeout(this._timeoutTimeout);
  };

  _setTimeouts = () => {
    const { delay, timeout, transition } = this.props;
    this._delayTimeout = setTimeout(() => transition('FETCH'), delay);
    if (timeout) {
      this._timeoutTimeout = setTimeout(() => {
        transition('TIMEOUT');
        this._clearTimeouts();
      }, timeout);
    }
  };

  componentDidMount = () => {
    const { loadOnMount } = this.props;
    loadOnMount && this.handleLoad();
  };

  handleLoad = (...args: any) => {
    const { isErrorSilent, fn, transition } = this.props;
    this._setTimeouts();
    return fn(...args)
      .then(response => {
        this.handleResponse({ response });
        transition('SUCCESS');
        return response;
      })
      .catch(err => {
        this.handleResponse({ error: err });
        transition('ERROR');
        if (!isErrorSilent) {
          throw err;
        }
      });
  };

  handleResponse = ({ response, error }: { response?: any, error?: any }) => { // eslint-disable-line
    this._clearTimeouts();
    this.setState({ error, response });
  };

  render = () => {
    const { children, name, machineState } = this.props;
    const { error, response } = this.state;
    const state = machineState.value;
    return children({
      Action: props => <AutomataAction channel={name} {...props} />,
      error,
      response,
      state,
      load: this.handleLoad
    });
  };
}

const _default = ({ name, ...props }: { name?: ?string }) =>
  createElement(withStatechart(statechart, { channel: name })(Loads), { name, ...props });

_default.defaultProps = { name: null };

export default _default;
