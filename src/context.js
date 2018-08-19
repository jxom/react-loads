// @flow
import React, { type Node } from 'react';
import idx from 'idx';
import { type SetResponseParams, type CacheProvider } from './_types';
import { STATES } from './statechart';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({
  data: {},
  globalCacheProvider: null,
  setResponse: (params: SetResponseParams) => {}
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
      cacheKey,
      cacheProvider: localCacheProvider,
      data: { error, response, state }
    } = params;
    const cacheProvider = localCacheProvider || globalCacheProvider;
    const value = {
      ...(state === STATES.SUCCESS ? { response } : {}),
      ...(state === STATES.ERROR ? { error } : {}),
      state
    };
    if (cacheProvider && cacheProvider.set) {
      cacheProvider.set(cacheKey, value);
    }
    this.setContextCache(cacheKey, value);
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
  cacheKey: string,
  cacheProvider?: CacheProvider,
  context: Object,
  children: Function
};
type ConsumerState = {
  cacheProviderData: Object,
  cacheProvider: ?CacheProvider,
  hasLoaded: boolean
};

class LoadsConsumer extends React.Component<ConsumerProps, ConsumerState> {
  state = {
    cacheProviderData: {},
    cacheProvider: this.props.cacheProvider || idx(this.props, _ => _.context.globalCacheProvider),
    hasLoaded: false
  };

  componentDidMount = () => {
    this.getCacheResponse();
  };

  componentDidUpdate = prevProps => {
    const { cacheKey: prevCacheKey } = prevProps;
    const { cacheKey } = this.props;
    if (cacheKey && cacheKey !== prevCacheKey) {
      this.getCacheResponse();
    }
  };

  getCacheResponse = () => {
    const { cacheKey, context } = this.props;
    const { cacheProvider } = this.state;
    if (cacheProvider && cacheProvider.get) {
      const cacheResponse = cacheProvider.get(cacheKey);
      if (cacheResponse && cacheResponse.then && typeof cacheResponse.then === 'function') {
        return cacheResponse
          .then(cacheProviderData => {
            this.setState({ cacheProviderData: { [cacheKey]: cacheResponse }, hasLoaded: true });
            context.setContextCache(cacheKey, cacheResponse);
          })
          .catch(err => {
            console.error(`Error loading data from cacheProvider (cacheKey: ${cacheKey}). Error: ${err}`);
            this.setState({ hasLoaded: true });
          });
      }
      this.setState({ cacheProviderData: { [cacheKey]: cacheResponse } });
      context.setContextCache(cacheKey, cacheResponse);
    }
    this.setState({ hasLoaded: true });
  };

  render = () => {
    const { cacheKey, context, children } = this.props;
    const { cacheProviderData, cacheProvider, hasLoaded } = this.state;
    return hasLoaded
      ? children({
          cache: cacheProviderData[cacheKey] || context.data[cacheKey],
          setResponse: data => context.setResponse({ cacheKey, cacheProvider, data })
        })
      : null;
  };
}

export default class extends React.PureComponent<{}> {
  static Provider = LoadsProvider;
  static Consumer = (props: Object) => <Consumer>{context => <LoadsConsumer context={context} {...props} />}</Consumer>;
}
