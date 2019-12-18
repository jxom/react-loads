import * as React from 'react';

import * as cache from './cache';
import { ContextArg, ConfigArg } from './types';

export function useCache(context: ContextArg, { variables }: { variables?: Array<unknown> } = {}) {
  let cacheKey = Array.isArray(context) ? context.join('.') : context;
  const variablesHash = React.useMemo(() => JSON.stringify(variables), [variables]);
  if (variablesHash) {
    cacheKey = `${cacheKey}.${variablesHash}`;
  }

  const [record, setRecord] = React.useState(() => cache.records.get(cacheKey));

  const handleData = React.useCallback(({ record }) => {
    setRecord(record);
  }, []);

  React.useEffect(() => {
    const updaters = cache.updaters.get(cacheKey);
    if (updaters) {
      const newUpdaters = [...updaters, handleData];
      cache.updaters.set(cacheKey, newUpdaters);
    } else {
      cache.updaters.set(cacheKey, [handleData]);
    }
  });

  return record;
}
