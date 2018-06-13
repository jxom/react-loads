// @flow
import React, { type Node } from 'react';
import store from 'store';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({ data: {}, setResponse: () => {} });

type ProviderProps = {
  children: Node
};
type ProviderState = {
  data: Object
};
type StorageItem = {
  response?: any,
  error?: any
};

const LocalStoragePrefix = 'LOADS_';
class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  state = { data: {} };

  setStaticResponse = (key: string, { response = null, error = null }: StorageItem) => {
    this.setState({ data: { ...this.state.data, [key]: { response, error } } });
  };

  setLocalStorageResponse = (key: string, { response = null, error = null }: StorageItem) => {
    store.set(`${LocalStoragePrefix}${key}`, { data: { response, error }, timestamp: Date.now() });
  };

  render = () => {
    const { children } = this.props;
    return (
      <Provider
        value={{
          data: this.state.data,
          setStaticResponse: this.setStaticResponse,
          setLocalStorageResponse: this.setLocalStorageResponse
        }}
      >
        {children}
      </Provider>
    );
  };
}

type ConsumerProps = {
  cacheKey: string,
  children: Function
};

class LoadsStateConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, children } = this.props;

    return (
      <Consumer>
        {context => {
          return children({
            ...context.data[cacheKey],
            hasResponseInCache: typeof context.data[cacheKey] !== 'undefined',
            setResponse: data => context.setStaticResponse(cacheKey, data)
          });
        }}
      </Consumer>
    );
  };
}
class LoadsLocalStorageConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, children } = this.props;
    return (
      <Consumer>
        {context => {
          const { data, timestamp } = store.get(`${LocalStoragePrefix}${cacheKey}`) || {};
          return children({
            ...data,
            cacheTimestamp: timestamp,
            hasResponseInCache: typeof data !== 'undefined',
            setResponse: data => context.setLocalStorageResponse(cacheKey, data)
          });
        }}
      </Consumer>
    );
  };
}

export default class extends React.PureComponent<{}> {
  static Provider = LoadsProvider;
  static StateConsumer = LoadsStateConsumer;
  static LocalStorageConsumer = LoadsLocalStorageConsumer;
}
