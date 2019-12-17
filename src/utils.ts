import { CACHE_STRATEGIES } from './constants';
import { ContextArg, CacheStrategy } from './types';

export function isDocumentVisible() {
  if (typeof document !== 'undefined' && typeof document.visibilityState !== 'undefined') {
    return document.visibilityState !== 'hidden';
  }
  return true;
}

export function isOnline() {
  if (typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

export function getCacheKey({
  context,
  variablesHash,
  cacheStrategy
}: {
  context: ContextArg | null;
  variablesHash: string;
  cacheStrategy: CacheStrategy;
}) {
  let cacheKey = Array.isArray(context) ? context.join('.') : context;
  if (variablesHash && cacheStrategy === CACHE_STRATEGIES.CONTEXT_AND_VARIABLES) {
    cacheKey = `${cacheKey}.${variablesHash}`;
  }
  return cacheKey;
}
