// @flow
import React, { type Node } from 'react';
import localStorage from './storages/local-storage';
import { STATES } from './statechart';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({ data: {}, setResponse: () => {} });

type ProviderProps = {
  children: Node,
  storagePrefix: string
};
type ProviderState = {
  data: Object
};
type ResponsePair = {
  response?: any,
  error?: any,
  state: STATES.SUCCESS | STATES.ERROR
};
type SetResponseParams = {
  key: string,
  data: ResponsePair,
  enableLocalStorageCache?: boolean
};

const DEFAULT_STORAGE_PREFIX = 'react-loads.';

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  static defaultProps = { storagePrefix: DEFAULT_STORAGE_PREFIX };

  state = { data: {} };

  setResponse = (params: SetResponseParams) => {
    const {
      key,
      data: { error, response, state },
      enableLocalStorageCache
    } = params;
    const value = {
      ...(state === STATES.SUCCESS ? { response } : {}),
      ...(state === STATES.ERROR ? { error } : {}),
      state
    };
    if (enableLocalStorageCache) {
      localStorage.set(`${this.props.storagePrefix}${key}`, value);
    }
    this.setState({
      data: { ...this.state.data, [key]: value }
    });
  };

  render = () => {
    const { storagePrefix, children } = this.props;
    return (
      <Provider
        value={{
          storagePrefix,
          data: this.state.data,
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
  enableLocalStorageCache?: boolean,
  children: Function
};

class LoadsConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, enableLocalStorageCache, children } = this.props;

    return (
      <Consumer>
        {context => {
          const localStorageData = localStorage.get(`${context.storagePrefix}${cacheKey}`);
          const cachedData = context.data[cacheKey] || localStorageData;
          return children({
            cache: cachedData,
            setResponse: data => context.setResponse({ key: cacheKey, data, enableLocalStorageCache })
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
