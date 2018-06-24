// @flow
import { STATES } from './statechart';

export type CacheProvider = {
  set: (key: string, value: any) => any,
  get: (key: string) => any
};
export type ResponsePair = {
  response?: any,
  error?: any,
  state: STATES.SUCCESS | STATES.ERROR
};
export type SetResponseParams = {
  cacheKey: string,
  cacheProvider?: CacheProvider,
  data: ResponsePair
};
