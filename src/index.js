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
      cacheProvider: null,
      contextKey: null,
      enableOptimisticResponse: false
    };

    render = () => {
      if (this.props.contextKey || this.props.enableOptimisticResponse) {
        return (
          <CacheContext.Consumer cacheProvider={this.props.cacheProvider} contextKey={this.props.contextKey}>
            {context => <Loads {...this.props} {...defaultProps} {...context} Provider={Provider} />}
          </CacheContext.Consumer>
        );
      }
      return <Loads {...this.props} {...defaultProps} Provider={Provider} />;
    };

    static Idle = Idle(Consumer);
    static Loading = Loading(Consumer);
    static Timeout = Timeout(Consumer);
    static Success = Success(Consumer);
    static Error = Error(Consumer);
  };
};

export default createLoader();
