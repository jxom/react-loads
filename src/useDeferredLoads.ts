import { useLoads } from './useLoads';
import { ContextArg, FnArg, ConfigArg } from './types';

export function useDeferredLoads<Response, Err>(
  contextOrFn: ContextArg | FnArg<Response>,
  fnOrConfig: FnArg<Response> | ConfigArg<Response, Err>,
  maybeConfig: ConfigArg<Response, Err>
) {
  let context = contextOrFn as ContextArg | null;
  let config = maybeConfig;

  let fn = fnOrConfig as FnArg<Response>;
  if (typeof contextOrFn === 'function') {
    context = null;
    fn = contextOrFn;
  }

  if (typeof fnOrConfig === 'object') {
    config = fnOrConfig;
  }

  return useLoads<Response, Err>(context, fn, { ...config, defer: true });
}
