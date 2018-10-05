/* eslint-disable react/prop-types */
import React from 'react';

const State = ({ state, Consumer }) => ({ children, or }) => (
  <Consumer>
    {value => {
      if (value[state]) {
        return typeof children === 'function' ? children(value) : children;
      }
      if (or) {
        let newOr = or;
        if (!Array.isArray(or)) {
          newOr = [or];
        }
        if (newOr.length === 0) return null;
        newOr = [...newOr];
        const Component = newOr.shift();
        return Component({ children, or: newOr });
      }
      return null;
    }}
  </Consumer>
);

export const Idle = Consumer => State({ Consumer, state: 'isIdle' });
export const Loading = Consumer => State({ Consumer, state: 'isLoading' });
export const Timeout = Consumer => State({ Consumer, state: 'isTimeout' });
export const Success = Consumer => State({ Consumer, state: 'isSuccess' });
export const Error = Consumer => State({ Consumer, state: 'isError' });
