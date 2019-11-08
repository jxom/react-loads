import * as React from 'react';
import * as PropTypes from 'prop-types';
import { LoadsConfig, LoadFunction } from './types';
import useLoads from './useLoads';

export type LoadsProps = LoadsConfig<unknown> & {
  context: string;
  children: (loader: any) => React.ReactNode;
  load: LoadFunction<unknown>;
  inputs?: Array<any>;
};

export const Loads = ({ children, context, load, inputs, ...config }: LoadsProps) => {
  const loader = useLoads(context, load, config);
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
