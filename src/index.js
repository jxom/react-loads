import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';

import Loads from './Loads';
import { Idle, Loading, Timeout, Success, Error } from './LoadsStates';
import CacheContext from './CacheContext';

export const LoadsProvider = CacheContext.Provider;

export const createLoader = (defaultProps = {}) => {
  const { Provider, Consumer } = createContext();

  return class extends Component {
    static displayName = 'Loads';

    static propTypes = {
      cacheProvider: PropTypes.shape({
        get: PropTypes.func,
        set: PropTypes.func
      }),
      contextKey: PropTypes.string,
      enableOptimisticResponse: PropTypes.bool
    };

    static defaultProps = {
      cacheProvider: defaultProps.cacheProvider,
      contextKey: defaultProps.contextKey,
      enableOptimisticResponse: defaultProps.enableOptimisticResponse || false
    };

    render = () => {
      const props = {
        ...defaultProps,
        ...this.props
      };
      if (props.contextKey || props.enableOptimisticResponse) {
        return (
          <CacheContext.Consumer cacheProvider={props.cacheProvider} contextKey={props.contextKey}>
            {context => <Loads {...props} {...context} Provider={Provider} />}
          </CacheContext.Consumer>
        );
      }
      return <Loads {...props} Provider={Provider} />;
    };

    static Idle = Idle(Consumer);
    static Loading = Loading(Consumer);
    static Timeout = Timeout(Consumer);
    static Success = Success(Consumer);
    static Error = Error(Consumer);
  };
};

export default createLoader();
