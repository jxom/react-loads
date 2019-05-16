import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LoadFunction } from './types';
import useLoads from './useLoads';

export type LoadsProps = {
  children: (loader: any) => React.ReactNode;
  fn: LoadFunction;
};

export const Loads: React.FunctionComponent<LoadsProps> = ({ children, fn, ...props }) => {
  const loader = useLoads(fn, props, []);
  return <React.Fragment>{children(loader)}</React.Fragment>;
};

Loads.propTypes = {
  children: PropTypes.func.isRequired,
  fn: PropTypes.func.isRequired
};

export default Loads;
