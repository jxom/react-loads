import * as React from 'react';
import { LoadsContext } from './LoadsContext';

export default function useLoadsContext(contextKey: string) {
  const context = React.useContext(LoadsContext);
  const record = context.cache[contextKey];
  return record;
}
