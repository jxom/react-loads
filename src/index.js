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

const LoadsContainer = (props: { cacheKey?: ?string, useLocalStorage?: any }) => {
  if (props.cacheKey) {
    return (
      <LoadsContext.Consumer cacheKey={props.cacheKey} useLocalStorage={props.useLocalStorage}>
        {({ error, hasResponseInCache, cacheTimestamp, response, setResponse }) => {
          return (
            <Loads
              {...props}
              error={error}
              hasResponseInCache={hasResponseInCache}
              cacheTimestamp={cacheTimestamp}
              response={response}
              setResponse={setResponse}
            />
          );
        }}
      </LoadsContext.Consumer>
    );
  }
  return <Loads {...props} />;
};

LoadsContainer.defaultProps = {
  cacheKey: null,
  useLocalStorage: false
};

export default withStatechart(statechart)(LoadsContainer);

export const LoadsProvider = LoadsContext.Provider;
