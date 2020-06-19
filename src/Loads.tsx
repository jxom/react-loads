import * as React from 'react';
import { LoadsConfig, LoadFunction } from './types';
import { useLoads } from './useLoads';

export type LoadsProps = LoadsConfig<unknown, unknown> & {
  context: string;
  children: (record: any) => React.ReactNode;
  fn: LoadFunction<unknown>;
  inputs?: Array<any>;
};

export const Loads = ({ children, context, fn, inputs, ...config }: LoadsProps) => {
  const record = useLoads(context, fn, config);
  return children(record);
};

Loads.defaultProps = {
  inputs: []
};
