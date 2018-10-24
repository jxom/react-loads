import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStateMachine } from 'react-automata';
import statechart, { EVENTS, STATES } from './statechart';
import { LOAD_POLICIES, getCachedResponseFromProps } from './utils';

export default withStateMachine(statechart)(
  class Loads extends Component {
    static propTypes = {
      cachedResponse: PropTypes.shape({
        error: PropTypes.any,
        response: PropTypes.any,
        state: PropTypes.oneOf([STATES.SUCCESS, STATES.ERROR])
      }),
      children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
      contextKey: PropTypes.string,
      delay: PropTypes.number,
      enableBackgroundStates: PropTypes.bool,
      getCachedResponse: PropTypes.func,
      isErrorSilent: PropTypes.bool,
      load: PropTypes.func,
      loadOnMount: PropTypes.bool,
      loadPolicy: PropTypes.oneOf(['cache-first', 'cache-and-load', 'load-only']),
      machineState: PropTypes.object.isRequired,
      setResponse: PropTypes.func,
      timeout: PropTypes.number,
      transition: PropTypes.func.isRequired,
      update: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
      Provider: PropTypes.object.isRequired
    };

    _count: number;
    _delayTimeout: any;
    _timeoutTimeout: any;
    _mounted: boolean;
    _paused: boolean;

    static defaultProps = {
      cachedResponse: null,
      contextKey: null,
      delay: 300,
      enableBackgroundStates: false,
      getCachedResponse: null,
      isErrorSilent: true,
      load: null,
      loadOnMount: false,
      loadPolicy: LOAD_POLICIES.CACHE_AND_LOAD,
      setResponse: null,
      timeout: 0,
      update: null
    };

    _count = 0;

    state = {
      contextKey: this.props.contextKey,
      ...getCachedResponseFromProps(this.props)
    };

    static getDerivedStateFromProps = (nextProps, state) => {
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
        this.handleLoad({ count: this._count })();
      }
    };

    componentDidUpdate = prevProps => {
      const { contextKey: prevContextKey } = prevProps;
      const { contextKey, loadOnMount } = this.props;

      if (contextKey && contextKey !== prevContextKey) {
        if (loadOnMount) {
          this._count = this._count + 1;
          this.handleLoad({ count: this._count })();
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

    handleLoad = ({ count, deferredFn }) => (...args: any) => {
      const { isErrorSilent, load: baseFn, loadPolicy } = this.props;
      const { hasResponseInCache } = this.state;

      if (loadPolicy === LOAD_POLICIES.CACHE_FIRST && hasResponseInCache) return null;
      if (this._paused) return null;

      this._setTimeouts();

      let fn = deferredFn || baseFn;
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

    handleUpdate = ({ count }) => {
      const { update } = this.props;
      if (Array.isArray(update)) {
        return update.map(deferredFn => this.handleLoad({ count, deferredFn }));
      }
      return this.handleLoad({ count, deferredFn: update });
    };

    handleResponse = ({ contextKey, count, error, event, response }) => {
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

    transition = event => {
      const { transition } = this.props;
      if (!this._mounted) {
        return;
      }
      transition(event);
    };

    render = () => {
      const { enableBackgroundStates, cachedResponse, children, machineState, Provider } = this.props;
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
        load: this.handleLoad({ count: this._count }),
        update: this.handleUpdate({ count: this._count }),
        resetState: () => this.transition(EVENTS.RESET)
      };
      return <Provider value={props}>{typeof children === 'function' ? children(props) : children}</Provider>;
    };
  }
);
