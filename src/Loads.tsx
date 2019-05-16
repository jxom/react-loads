import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LoadFunction } from './types';
import useLoads from './useLoads';

export type LoadsProps = {
  children: (loader: any) => React.ReactNode;
  load: LoadFunction;
  inputs?: Array<any>;
};

export const Loads: React.FunctionComponent<LoadsProps> = ({ children, load, inputs, ...props }) => {
  const loader = useLoads(load, props, inputs || []);
  return <React.Fragment>{children(loader)}</React.Fragment>;
};

Loads.propTypes = {
  children: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  inputs: PropTypes.array
};

Loads.defaultProps = {
  inputs: []
};

export default Loads;
