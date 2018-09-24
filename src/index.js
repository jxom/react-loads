// @flow
import React from 'react';
import Loads from './Loads';
import LoadsContext from './context';
import { type CacheProvider } from './_types';

type Props = {
  cacheProvider?: CacheProvider,
  contextKey?: ?string,
  enableOptimisticResponse?: boolean
};

const LoadsContainer = (props: Props) => {
  if (props.contextKey || props.enableOptimisticResponse) {
    return (
      <LoadsContext.Consumer cacheProvider={props.cacheProvider} contextKey={props.contextKey}>
        {context => <Loads {...props} {...context} />}
      </LoadsContext.Consumer>
    );
  }
  return <Loads {...props} />;
};

LoadsContainer.defaultProps = {
  cacheProvider: null,
  contextKey: null,
  enableOptimisticResponse: false
};

export default LoadsContainer;

export const LoadsProvider = LoadsContext.Provider;
