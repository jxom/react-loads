// @flow
import React, { type Node } from 'react';
import LocalStorage from './storages/local-storage';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({ data: {}, setResponse: () => {} });

type ProviderProps = {
  children: Node,
  storagePrefix: string
};
type ProviderState = {
  data: Object,
  cacheTimestamps: Object
};
type ResponsePair = {
  response: any,
  error: any
};
type SetResponseParams = {
  key: string,
  data: ResponsePair,
  useLocalStorage: boolean
};

const DEFAULT_STORAGE_PREFIX = 'react-loads.';

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  static defaultProps = { storagePrefix: DEFAULT_STORAGE_PREFIX };

  state = { data: {}, cacheTimestamps: {} };

  setResponse = (params: SetResponseParams) => {
    const { key, data = { response: null, error: null }, useLocalStorage } = params;
    const timestamp = Date.now();
    if (useLocalStorage) {
      LocalStorage.set(`${this.props.storagePrefix}${key}`, { data, timestamp });
    }
    this.setState({
      data: { ...this.state.data, [key]: data },
      cacheTimestamps: { ...this.state.cacheTimestamps, [key]: timestamp }
    });
  };

  render = () => {
    const { storagePrefix, children } = this.props;
    return (
      <Provider
        value={{
          storagePrefix,
          data: this.state.data,
          cacheTimestamps: this.state.cacheTimestamps,
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
  useLocalStorage: boolean,
  children: Function
};

class LoadsConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, useLocalStorage, children } = this.props;

    return (
      <Consumer>
        {context => {
          const { data, timestamp } = LocalStorage.get(`${context.storagePrefix}${cacheKey}`) || {};

          const cachedData = context.data[cacheKey] || data;
          const cacheTimestamp = context.cacheTimestamps[cacheKey] || timestamp;

          return children({
            ...cachedData,
            cacheTimestamp,
            hasResponseInCache: typeof cachedData !== 'undefined',
            setResponse: data => context.setResponse({ key: cacheKey, data, useLocalStorage })
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
