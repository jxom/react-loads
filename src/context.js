// @flow
import React, { type Node } from 'react';
import { STATES } from './statechart';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({ data: {}, setResponse: () => {} });

type ProviderProps = {
  children: Node
};
type ProviderState = {
  data: Object
};

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  state = { data: {} };

  setResponse = (key: string, { response, error, state }: { response?: any, error?: any, state: string }) => {
    const value = {
      ...(state === STATES.SUCCESS ? { response } : {}),
      ...(state === STATES.ERROR ? { error } : {}),
      state
    };
    this.setState({ data: { ...this.state.data, [key]: value } });
  };

  render = () => {
    const { children } = this.props;
    return <Provider value={{ data: this.state.data, setResponse: this.setResponse }}>{children}</Provider>;
  };
}

type ConsumerProps = {
  cacheKey: string,
  children: Function
};

class LoadsConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, children } = this.props;
    return (
      <Consumer>
        {context =>
          children({
            cache: context.data[cacheKey],
            setResponse: data => context.setResponse(cacheKey, data)
          })
        }
      </Consumer>
    );
  };
}

export default class extends React.PureComponent<{}> {
  static Provider = LoadsProvider;
  static Consumer = LoadsConsumer;
}
