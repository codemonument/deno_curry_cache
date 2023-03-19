/**
 * These options can be used to alter the behavior of a function curried by corryCache function.
 */
export interface CacheAccessOptions {
  /**
   * Normally, the cacheKey wil be auto-generated based on the function name of the curried function and a hash of the parameter list.
   * Problem: Sometimes a function has params, which throw exceptions while hashing.
   * This customCacheKeyPostfix option allows to differentiate function calls to curried functions manually.
   */
  customCacheKeyPostfix?: string;
}
