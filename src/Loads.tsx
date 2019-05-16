import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LoadFunction, StateComponentProps } from './types';
import useLoads from './useLoads';
import StateComponent from './StateComponent';

export type LoadsProps = {
  children: (loader: any) => React.ReactNode;
  load: LoadFunction;
  inputs?: Array<any>;
};

const StateContext = React.createContext({
  isIdle: false,
  isPending: false,
  isTimeout: false,
  isResolved: false,
  isRejected: false
});

export const Loads: React.FunctionComponent<LoadsProps> & {
  Idle: React.FunctionComponent<StateComponentProps>;
  Pending: React.FunctionComponent<StateComponentProps>;
  Timeout: React.FunctionComponent<StateComponentProps>;
  Resolved: React.FunctionComponent<StateComponentProps>;
  Rejected: React.FunctionComponent<StateComponentProps>;
} = ({ children, load, inputs, ...props }) => {
  const loader = useLoads(load, props, inputs || []);
  return (
    <StateContext.Provider value={loader}>
      {typeof children === 'function' ? children(loader) : children}
    </StateContext.Provider>
  );
};

Loads.propTypes = {
  children: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  inputs: PropTypes.array
};

Loads.defaultProps = {
  inputs: []
};

Loads.Idle = props => (
  <StateContext.Consumer>{loader => StateComponent(loader.isIdle)(props, loader)}</StateContext.Consumer>
);
Loads.Pending = (props: StateComponentProps) => (
  <StateContext.Consumer>{loader => StateComponent(loader.isPending)(props, loader)}</StateContext.Consumer>
);
Loads.Timeout = (props: StateComponentProps) => (
  <StateContext.Consumer>{loader => StateComponent(loader.isTimeout)(props, loader)}</StateContext.Consumer>
);
Loads.Resolved = (props: StateComponentProps) => (
  <StateContext.Consumer>{loader => StateComponent(loader.isResolved)(props, loader)}</StateContext.Consumer>
);
Loads.Rejected = (props: StateComponentProps) => (
  <StateContext.Consumer>{loader => StateComponent(loader.isRejected)(props, loader)}</StateContext.Consumer>
);

export default Loads;
