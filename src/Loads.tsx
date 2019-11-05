import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LoadsConfig, LoadFunction } from './types';
import useLoads from './useLoads';

export type LoadsProps = LoadsConfig<unknown> & {
  children: (loader: any) => React.ReactNode;
  load: LoadFunction<unknown>;
  inputs?: Array<any>;
};

export const Loads = ({ children, load, inputs, ...props }: LoadsProps) => {
  const loader = useLoads(load, props, inputs || []);
  return children(loader);
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
