import { LoadPolicy, LoadingState, CacheStrategy } from './types';

export const CACHE_STRATEGIES: { [key: string]: CacheStrategy } = {
  CONTEXT_ONLY: 'context-only',
  CONTEXT_AND_VARIABLES: 'context-and-variables'
};

export const LOAD_POLICIES: { [key: string]: LoadPolicy } = {
  CACHE_FIRST: 'cache-first',
  CACHE_AND_LOAD: 'cache-and-load',
  LOAD_ONLY: 'load-only',
  CACHE_ONLY: 'cache-only'
};

export const STATES: { [key: string]: LoadingState } = {
  IDLE: 'idle',
  PENDING: 'pending',
  PENDING_SLOW: 'pending-slow',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
  RELOADING: 'reloading',
  RELOADING_SLOW: 'reloading-slow'
};
