import { CurryCacheStorageEngine } from "./CurryCacheStorageEngine.ts";
import { CacheKeyParts } from "./CacheKeyParts.ts";
export interface CurryCacheOptions<StorageEngineOptions> {
  storageEngine: CurryCacheStorageEngine<StorageEngineOptions>;

  /**
   * A function which calculates a string key which is used as the cache key for a function response.
   * If not defined, the consuming code will use the defaultCacheKeyFactory function.
   */
  overrideCacheKeyFactory?: (cacheKeyParts: CacheKeyParts) => string;

  /**
   * This option ignores the function params of an input function for currying if set.
   * This is the simplest possible mode, since each function cached with this option=true can only cache
   * exactly one return value, regardless of the input params.
   */
  ignoreFunctionArgsForCacheKey?: boolean;
}
