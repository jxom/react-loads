import { LoadingState } from './types';

export const LOAD_POLICIES = {
  CACHE_FIRST: 'cache-first' as 'cache-first',
  CACHE_AND_LOAD: 'cache-and-load' as 'cache-and-load',
  LOAD_ONLY: 'load-only' as 'load-only',
  CACHE_ONLY: 'cache-only' as 'cache-only'
};

export const STATES: { [key: string]: LoadingState } = {
  IDLE: 'idle',
  PENDING: 'pending',
  TIMEOUT: 'timeout',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};
