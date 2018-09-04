// @flow
import React from 'react';
import Loads from './Loads';
import LoadsContext from './context';
import { type CacheProvider } from './_types';

const LoadsContainer = (props: { cacheProvider?: CacheProvider, contextKey?: ?string }) => {
  if (props.contextKey) {
    return (
      <LoadsContext.Consumer cacheProvider={props.cacheProvider} contextKey={props.contextKey}>
        {({ cache, setResponse }) => <Loads {...props} cache={cache} setResponse={setResponse} />}
      </LoadsContext.Consumer>
    );
  }
  return <Loads {...props} />;
};

LoadsContainer.defaultProps = {
  cacheProvider: null,
  contextKey: null
};

export default LoadsContainer;

export const LoadsProvider = LoadsContext.Provider;
