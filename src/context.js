// @flow
import React, { type Node } from 'react';
import idx from 'idx';
import { type SetResponseParams, type CacheProvider } from './_types';
import { STATES } from './statechart';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({
  data: {},
  globalCacheProvider: null,
  setContextCache: () => {},
  setResponse: () => {}
});

type ProviderProps = {
  children: Node,
  cacheProvider?: CacheProvider
};
type ProviderState = {
  data: Object,
  globalCacheProvider?: CacheProvider,
  setResponse: Function
};

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  setContextCache = (key: string, value: any) => {
    this.setState(prevState => ({
      data: { ...prevState.data, [key]: value }
    }));
  };

  setResponse = (params: SetResponseParams) => {
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

type ConsumerProps = {
  contextKey: string,
  cacheProvider?: CacheProvider,
  context: Object,
  children: Function
};
type ConsumerState = {
  contextKey: string,
  cacheProviderData: Object,
  cacheProvider: ?CacheProvider,
  hasLoaded: boolean
};

class LoadsConsumer extends React.Component<ConsumerProps, ConsumerState> {
  state = {
    contextKey: null,
    cacheProviderData: {},
    cacheProvider: this.props.cacheProvider || idx(this.props, _ => _.context.globalCacheProvider),
    hasLoaded: false
  };

  static getDerivedStateFromProps = (nextProps: ConsumerProps, prevState: ConsumerState) => {
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
  static Consumer = (props: Object) => <Consumer>{context => <LoadsConsumer context={context} {...props} />}</Consumer>;
}
