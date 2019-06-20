import * as React from 'react';
import { LoadsContext } from './LoadsContext';

export default function useLoadsCache(contextKey: string) {
  const context = React.useContext(LoadsContext);
  const record = context.cache.get(contextKey);
  return record;
}
