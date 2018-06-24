// @flow
import React, { type Node } from 'react';
import { type SetResponseParams, type CacheProvider } from './_types';
import { STATES } from './statechart';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({ data: {}, setResponse: () => {} });

type ProviderProps = {
  children: Node,
  cacheProvider?: Object
};
type ProviderState = {
  data: Object
};

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  state = { data: {} };

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
    this.setState({
      data: { ...this.state.data, [cacheKey]: value }
    });
  };

  render = () => {
    const { children, cacheProvider: globalCacheProvider } = this.props;
    return (
      <Provider
        value={{
          data: this.state.data,
          globalCacheProvider,
          setResponse: this.setResponse
        }}
      >
        {children}
      </Provider>
    );
  };
}

type ConsumerProps = {
  cacheKey: string,
  cacheProvider?: CacheProvider,
  children: Function
};

class LoadsConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, cacheProvider: localCacheProvider, children } = this.props;

    return (
      <Consumer>
        {context => {
          const cacheProvider = localCacheProvider || context.globalCacheProvider;
          let cachedData = context.data[cacheKey];
          if (cacheProvider && cacheProvider.get) {
            cachedData = cacheProvider.get(cacheKey);
          }
          return children({
            cache: cachedData,
            setResponse: data => context.setResponse({ cacheKey, cacheProvider, data })
          });
        }}
      </Consumer>
    );
  };
}

export default class extends React.PureComponent<{}> {
  static Provider = LoadsProvider;
  static Consumer = LoadsConsumer;
}
