import {
  CacheAccessOptions,
  CurryCacheOptions,
  CurryInputFunction,
  CurryOutputFunction,
} from "./types.ts";
import { defaultCacheKeyFactory } from "./defaultCacheKeyFactory.ts";

/**
 * This function uses some kind of "pseudo-function currying"
 * to wrap an existing function with a persistnent cache.
 * When the cache is not available, it will call the original method.
 * Otherwise it will resolve the function call with the
 *
 * CAUTION: The functions return type must be string or something which is json serializable!
 * (At least for now!)
 */
export function curryCache<T>(
  inputFunction: CurryInputFunction,
  { storageEngine, overrideCacheKeyFactory }: CurryCacheOptions<T>,
): CurryOutputFunction {
  const cacheKeyFactory = overrideCacheKeyFactory ?? defaultCacheKeyFactory;

  // This is the wrapper function arount the inputFunction which deals with the caching
  return async (
    callArgs: Parameters<CurryInputFunction>,
    options?: CacheAccessOptions,
  ) => {
    // Note: when you have two input functions with the same name and the same storageEngine,
    // you can add an customCacheKeyPostfix to differentiate them from each other
    const { customCacheKeyPostfix } = options || {};

    const cacheKey = cacheKeyFactory({
      inputFunctionName: inputFunction.name,
      inputFunctionArgs: callArgs,
      customCacheKeyPostfix,
    });

    const cacheContentString = await storageEngine.readCacheEntry(cacheKey);

    if (cacheContentString === undefined) {
      // Wrapping this function call to inputFunction into a promise allows me to await that promise.
      // If inputFunction does return a promise already, it will be flattened by the js runtime.
      const origResult = await Promise.resolve(
        inputFunction(...callArgs),
      );
      const json = JSON.stringify(origResult);
      await storageEngine.writeCacheEntry(cacheKey, json);
      return origResult;
    }

    const jsObject = JSON.parse(cacheContentString);
    return jsObject;
  };
}
