import * as React from 'react';
import { LOAD_POLICIES, CACHE_STRATEGIES } from './constants';
import { LoadsConfig } from './types';

export const defaultConfig = {
  cacheTime: 0,
  cacheStrategy: CACHE_STRATEGIES.CONTEXT_AND_VARIABLES,
  dedupingInterval: 500,
  delay: 0,
  defer: false,
  loadPolicy: LOAD_POLICIES.CACHE_AND_LOAD,
  revalidateOnWindowFocus: false,
  revalidateTime: 300000,
  suspense: false,
  throwError: false,
  timeout: 5000
};

export const Context = React.createContext(defaultConfig);

export function Provider({ children, config }: { children: React.ReactNode; config: LoadsConfig<any, any> }) {
  const newConfig = React.useMemo(() => Object.assign(defaultConfig, config), [config]);
  return <Context.Provider value={newConfig}>{children}</Context.Provider>;
}
