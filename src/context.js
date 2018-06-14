// @flow
import React, { type Node } from 'react';
import LocalStorage from './storages/local';

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
  response: any,
  error: any
};

const DefaultStoragePrefix = 'react_loads_';

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  static defaultProps = { storagePrefix: DefaultStoragePrefix };

  state = { data: {} };

  setStaticResponse = (key: string, { response = null, error = null }: ResponsePair) => {
    this.setState({ data: { ...this.state.data, [key]: { response, error } } });
  };

  setLocalStorageResponse = (key: string, { response = null, error = null }: ResponsePair) => {
    LocalStorage.set(`${this.props.storagePrefix}${key}`, { data: { response, error }, timestamp: Date.now() });
  };

  render = () => {
    const { storagePrefix, children } = this.props;
    return (
      <Provider
        value={{
          storagePrefix,
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
          const { data, timestamp } = LocalStorage.get(`${context.storagePrefix}${cacheKey}`) || {};
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
