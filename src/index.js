// @flow

import { Component } from 'react';

type Props = {
  children: ({ response?: any, error?: any, load?: () => Promise<void> }) => any,
  delay?: number,
  loadImmediately?: boolean,
  loadingFunc: (...args: any) => Promise<any>,
  onLoadingRenderer?: ({ hasTimedOut?: boolean }) => any,
  timeout?: number
};
type State = {
  error: any,
  hasLoaded: boolean,
  hasTimedOut: boolean,
  isLoading: boolean,
  response: any
};

export default class Loads extends Component<Props, State> {
  static defaultProps = {
    delay: 300,
    loadImmediately: false,
    timeout: 0
  };
  _delayTimeout: any;
  _timeoutTimeout: any;

  state = { error: null, hasLoaded: false, isLoading: this.props.delay === 0, hasTimedOut: false, response: null };

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

  componentDidMount = () => {
    const { loadImmediately } = this.props;
    loadImmediately && this.handleLoad().catch(err => {});
  };

  handleLoad = (...args: any) => {
    const { loadingFunc } = this.props;
    this._setTimeouts();
    return loadingFunc(...args)
      .then(response => {
        this.handleResponse({ response });
        return response;
      })
      .catch(err => {
        this.handleResponse({ error: err });
        throw err;
      });
  };

  handleResponse = ({ response, error }: { response?: any, error?: any }) => { // eslint-disable-line
    this._clearTimeouts();
    this.setState({ error, hasLoaded: true, isLoading: false, response });
  };

  render = () => {
    const { children, onLoadingRenderer } = this.props;
    const { error, hasTimedOut, hasLoaded, isLoading, response } = this.state;
    if (onLoadingRenderer && (isLoading || hasTimedOut)) {
      return onLoadingRenderer({ hasTimedOut });
    }
    return children({ error, hasLoaded, isLoading, hasTimedOut, response, load: this.handleLoad });
  };
}
