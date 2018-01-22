// @flow

import React, { Component } from 'react';

type Props = {
  delay?: number,
  loadingFunc: () => ?Promise<any>,
  onLoadingRenderer: ({ hasTimedOut: boolean }) => any,
  onLoadedRenderer: ({ response?: any, error?: any }) => any,
  timeout?: number
};
type State = {
  error: any,
  hasLoaded: boolean,
  hasTimedOut: boolean,
  isLoading: boolean,
  response: any
};

// todo: pastDelay, timedOut

export default class Loads extends Component<Props, State> {
  static defaultProps = {
    delay: 300,
    timeout: 0
  };
  _delayTimeout: any;
  _timeoutTimeout: any;

  state = { error: null, hasLoaded: false, isLoading: false, hasTimedOut: false, response: null };

  _clearTimeouts = () => {
    clearTimeout(this._delayTimeout);
    clearTimeout(this._timeoutTimeout);
  };

  _setTimeouts = () => {
    const { delay, timeout } = this.props;
    this._delayTimeout = setTimeout(() => this.setState({ isLoading: true }), delay);
    if (timeout) {
      this._timeoutTimeout = setTimeout(() => {
        this.setState({ hasTimedOut: true });
        this._clearTimeouts();
      }, timeout);
    }
  };

  componentDidMount = async () => {
    const { loadingFunc } = this.props;
    this._setTimeouts();
    try {
      const response = await loadingFunc();
      this.handleResponse({ response });
    } catch (err) {
      this.handleResponse({ error: err });
    }
  };

  handleResponse = ({ response, error }: { response?: any, error?: any }) => { // eslint-disable-line
    this._clearTimeouts();
    this.setState({ error, isLoading: false, hasLoaded: true, response });
  };

  render = () => {
    const { onLoadingRenderer, onLoadedRenderer } = this.props;
    const { error, hasLoaded, hasTimedOut, isLoading, response } = this.state;
    if (isLoading || hasTimedOut) {
      return onLoadingRenderer({ hasTimedOut });
    } else if (hasLoaded) {
      return onLoadedRenderer({ error, response });
    }
    return <div />;
  };
}
