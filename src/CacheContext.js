import React from 'react';
import PropTypes from 'prop-types';
import idx from 'idx';
import { STATES } from './statechart';

const { Provider, Consumer } = React.createContext({
  data: {},
  globalCacheProvider: null,
  setContextCache: () => {},
  setResponse: () => {}
});

class LoadsProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    cacheProvider: PropTypes.shape({
      get: PropTypes.func,
      set: PropTypes.func
    })
  };

  static defaultProps = {
    cacheProvider: null
  };

  setContextCache = (key, value) => {
    this.setState(prevState => ({
      data: { ...prevState.data, [key]: value }
    }));
  };

  setResponse = params => {
    const { cacheProvider: globalCacheProvider } = this.props;
    const {
      contextKey,
      cacheProvider: localCacheProvider,
      data: { error, response, state }
    } = params;
    if (!contextKey) return;
    const cacheProvider = localCacheProvider || globalCacheProvider;
    const value = {
      ...(state === STATES.SUCCESS ? { response } : {}),
      ...(state === STATES.ERROR ? { error } : {}),
      state
    };
    if (cacheProvider && cacheProvider.set) {
      cacheProvider.set(contextKey, value);
    }
    this.setContextCache(contextKey, value);
  };

  state = {
    data: {},
    globalCacheProvider: this.props.cacheProvider,
    setContextCache: this.setContextCache,
    setResponse: this.setResponse
  };

  render = () => {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  };
}

class LoadsConsumer extends React.Component {
  static propTypes = {
    cacheProvider: PropTypes.shape({
      get: PropTypes.func,
      set: PropTypes.func
    }),
    children: PropTypes.node.isRequired,
    contextKey: PropTypes.string.isRequired,
    context: PropTypes.object.isRequired
  };

  static defaultProps = {
    cacheProvider: null
  };

  state = {
    contextKey: null,
    cacheProviderData: {},
    cacheProvider: this.props.cacheProvider || idx(this.props, _ => _.context.globalCacheProvider),
    hasLoaded: false
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.contextKey !== prevState.contextKey) {
      return { contextKey: nextProps.contextKey, cacheProviderData: {}, hasLoaded: false };
    }
    return {};
  };

  componentDidMount = () => {
    this.getCachedResponseFromCacheProvider();
  };

  componentDidUpdate = prevProps => {
    const { contextKey: prevContextKey } = prevProps;
    const { contextKey } = this.props;
    if (contextKey && contextKey !== prevContextKey) {
      this.getCachedResponseFromCacheProvider();
    }
  };

  getCachedResponseFromCacheProvider = () => {
    const { contextKey, context } = this.props;
    const { cacheProvider } = this.state;
    if (cacheProvider && cacheProvider.get) {
      const cacheResponse = cacheProvider.get(contextKey);
      if (cacheResponse) {
        if (cacheResponse.then && typeof cacheResponse.then === 'function') {
          return cacheResponse
            .then(cacheProviderData => {
              this.setState({ cacheProviderData: { [contextKey]: cacheResponse }, hasLoaded: true });
              context.setContextCache(contextKey, cacheResponse);
            })
            .catch(err => {
              console.error(`Error loading data from cacheProvider (contextKey: ${contextKey}). Error: ${err}`);
              this.setState({ hasLoaded: true });
            });
        }
        this.setState({ cacheProviderData: { [contextKey]: cacheResponse } });
        context.setContextCache(contextKey, cacheResponse);
      }
    }
    this.setState({ hasLoaded: true });
  };

  getCachedResponse = ({ contextKey }) => {
    const { context } = this.props;
    const { cacheProviderData } = this.state;
    return cacheProviderData[contextKey] || context.data[contextKey];
  };

  render = () => {
    const { contextKey, context, children } = this.props;
    const { cacheProvider, hasLoaded } = this.state;
    return hasLoaded
      ? children({
          cachedResponse: this.getCachedResponse({ contextKey }),
          getCachedResponse: this.getCachedResponse,
          setResponse: data => context.setResponse({ contextKey: data.contextKey || contextKey, cacheProvider, data })
        })
      : null;
  };
}

export default class extends React.PureComponent<{}> {
  static Provider = LoadsProvider;
  static Consumer = props => <Consumer>{context => <LoadsConsumer context={context} {...props} />}</Consumer>;
}
