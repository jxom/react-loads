// @flow
import React from 'react';
import { withStatechart } from 'react-automata';
import Loads from './Loads';
import LoadsContext from './context';
import statechart from './statechart';

const LoadsContainer = (props: { cacheKey?: ?string }) => {
  if (props.cacheKey) {
    return (
      <LoadsContext.Consumer cacheKey={props.cacheKey}>
        {({ cache, setResponse }) => <Loads {...props} cache={cache} setResponse={setResponse} />}
      </LoadsContext.Consumer>
    );
  }
  return <Loads {...props} />;
};

LoadsContainer.defaultProps = {
  cacheKey: null
};

export default withStatechart(statechart)(LoadsContainer);

export const LoadsProvider = LoadsContext.Provider;
