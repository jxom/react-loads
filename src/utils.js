export const LOAD_POLICIES = {
  CACHE_FIRST: 'cache-first',
  CACHE_AND_LOAD: 'cache-and-load',
  LOAD_ONLY: 'load-only'
};
export const CACHEABLE_LOAD_POLICIES = [LOAD_POLICIES.CACHE_FIRST, LOAD_POLICIES.CACHE_AND_LOAD];

export const getCachedResponseFromProps = props => {
  const { contextKey, getCachedResponse, loadPolicy } = props;
  if (getCachedResponse) {
    const cache = getCachedResponse({ contextKey });
    if (cache && CACHEABLE_LOAD_POLICIES.includes(loadPolicy)) {
      const { error, response, state } = cache;
      return {
        hasResponseInCache: true,
        cachedState: state,
        error,
        response
      };
    }
  }
  return {
    hasResponseInCache: false
  };
};
