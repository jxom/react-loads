// @flow
import React from 'react';
import { withStatechart } from 'react-automata';
import Loads from './Loads';
import LoadsContext from './context';
import statechart from './statechart';
import { type CacheProvider } from './_types';

const LoadsContainer = (props: { cacheKey?: ?string, cacheProvider?: CacheProvider, loadOnMount: boolean }) => {
  if (props.cacheKey) {
    return (
      <LoadsContext.Consumer
        cacheKey={props.cacheKey}
        cacheProvider={props.cacheProvider}
        loadOnMount={props.loadOnMount}
      >
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

export default withStatechart(statechart)(LoadsContainer);

export const LoadsProvider = LoadsContext.Provider;
