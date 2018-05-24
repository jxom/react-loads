// @flow
import React from 'react';
import { withStatechart } from 'react-automata';
import Loads from './Loads';
import LoadsContext from './context';

const statechart = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    loading: {
      on: {
        TIMEOUT: 'timeout',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    timeout: {
      on: {
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    success: {
      on: {
        RESET: 'idle',
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    },
    error: {
      on: {
        RESET: 'idle',
        FETCH: 'loading',
        SUCCESS: 'success',
        ERROR: 'error'
      }
    }
  }
};

const LoadsContainer = (props: { cacheKey?: ?string }) => {
  if (props.cacheKey) {
    return (
      <LoadsContext.Consumer cacheKey={props.cacheKey}>
        {({ error, hasResponseInCache, response, setResponse }) => (
          <Loads
            {...props}
            error={error}
            hasResponseInCache={hasResponseInCache}
            response={response}
            setResponse={setResponse}
          />
        )}
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
