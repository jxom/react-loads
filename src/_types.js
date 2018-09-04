// @flow
import { STATES } from './statechart';

export type CacheProvider = {
  set: (key: string, value: any) => any,
  get: (key: string) => any
};
export type LoadPolicy = 'cache-first' | 'cache-and-load' | 'load-only';
export type ResponsePair = {
  response?: any,
  error?: any,
  state: STATES.SUCCESS | STATES.ERROR
};
export type SetResponseParams = {
  contextKey: string,
  cacheProvider?: CacheProvider,
  data: ResponsePair
};
