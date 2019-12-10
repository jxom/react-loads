import { LoadPolicy, LoadingState } from './types';

export const CACHE_STRATEGIES = {
  KEY_ONLY: 'key-only',
  KEY_AND_VARIABLES: 'key-and-variables'
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
