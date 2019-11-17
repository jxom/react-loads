import * as React from 'react';

import * as cache from './cache';
import { ContextArg, ConfigArg } from './types';

export function useCache(context: ContextArg, { variables }: { variables?: Array<unknown> } = {}) {
  let contextKey = Array.isArray(context) ? context.join('.') : context;
  const variablesHash = React.useMemo(() => JSON.stringify(variables), [variables]);
  if (variablesHash) {
    contextKey = `${contextKey}.${variablesHash}`;
  }

  const [record, setRecord] = React.useState(() => cache.records.get(contextKey));

  const handleData = React.useCallback(({ record }) => {
    setRecord(record);
  }, []);

  React.useEffect(() => {
    const updaters = cache.updaters.get(contextKey);
    if (updaters) {
      const newUpdaters = [...updaters, handleData];
      cache.updaters.set(contextKey, newUpdaters);
    } else {
      cache.updaters.set(contextKey, [handleData]);
    }
  });

  return record;
}
