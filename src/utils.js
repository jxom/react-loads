export const LOAD_POLICIES = {
  CACHE_FIRST: 'cache-first',
  CACHE_AND_LOAD: 'cache-and-load',
  LOAD_ONLY: 'load-only'
};
export const CACHEABLE_LOAD_POLICIES = [LOAD_POLICIES.CACHE_FIRST, LOAD_POLICIES.CACHE_AND_LOAD];

export const getCachedResponseFromProps = props => {
  const { cache, loadPolicy } = props;
  if (cache && CACHEABLE_LOAD_POLICIES.includes(loadPolicy)) {
    const { error, response } = cache;
    return {
      hasResponseInCache: true,
      error,
      response
    };
  }
  return {
    hasResponseInCache: false
  };
};
