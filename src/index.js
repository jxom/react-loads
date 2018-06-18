// @flow
import React from 'react';
import { withStatechart } from 'react-automata';
import Loads from './Loads';
import LoadsContext from './context';
import statechart from './statechart';

const LoadsContainer = (props: { cacheKey?: ?string, enableLocalStorageCache?: boolean }) => {
  if (props.cacheKey) {
    return (
      <LoadsContext.Consumer cacheKey={props.cacheKey} enableLocalStorageCache={props.enableLocalStorageCache}>
        {({ cache, setResponse }) => <Loads {...props} cache={cache} setResponse={setResponse} />}
      </LoadsContext.Consumer>
    );
  }
  return <Loads {...props} />;
};

LoadsContainer.defaultProps = {
  cacheKey: null,
  enableLocalStorageCache: false
};

export default withStatechart(statechart)(LoadsContainer);

export const LoadsProvider = LoadsContext.Provider;
