// @flow
import React from 'react';
import Loads from './Loads';
import LoadsContext from './context';
import { type CacheProvider } from './_types';

const LoadsContainer = (props: { cacheKey?: ?string, cacheProvider?: CacheProvider }) => {
  if (props.cacheKey) {
    return (
      <LoadsContext.Consumer cacheKey={props.cacheKey} cacheProvider={props.cacheProvider}>
        {({ cache, setResponse }) => <Loads {...props} cache={cache} setResponse={setResponse} />}
      </LoadsContext.Consumer>
    );
  }
  return <Loads {...props} />;
};

LoadsContainer.defaultProps = {
  cacheKey: null,
  cacheProvider: null
};

export default LoadsContainer;

export const LoadsProvider = LoadsContext.Provider;
