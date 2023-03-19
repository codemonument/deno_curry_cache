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

export interface CacheKeyParts {
    /**
     * The name of the function which is curried.
     * Is never undefined, but may clash when a function with the same name but from another scope
     * is curryCached with the same storage engine
     */
    inputFunctionName: string;

    /**
     * The parameters passed to the curried function to be passed to the input function.
     * Can be used to calculate hashes for example to distinguish different calls to the same function
     */
    inputFunctionArgs?: any[];

    /**
     * A custom key which can be set by the caller of the curried function to distinguish the cacheKey manually
     */
    customCacheKeyPostfix?: string;
}

/**
* An interface defining CRUD methods for a storage engine, which can be used with CurryCache.
* This allows for switching between localStorage, DB-backed storage, etc.
*/
export interface CurryCacheStorageEngine<StorageEngineOptions> {
    engineOptions: StorageEngineOptions;

    /**
     * Returns the cache entry with the specified key or undefined
     * @param cacheKey
     */
    readCacheEntry(cacheKey: string): Promise<string | undefined>;

    /**
     * Returns the whole cache as js object Record of
     * string cache keys => string content
     * Note: string content can be any string, but will likely be
     * the JSON.stringify() output of the function response which should be cached.
     *
     * @returns the cache records, if found, otherwise 'undefined'
     * @throws for any other error
     */
    readCache(): Promise<Record<string, string> | undefined>;

    /**
     * Clears the complete cache in this storageEngine instance
     */
    clearCache(): Promise<void>;

    /**
     * Overwrites the whole cache
     * @param cacheObject
     */
    writeCache(cacheObject: Record<string, string>): Promise<void>;

    /**
     * Overwrites one record entry in the cache
     * @param cacheKey
     * @param content
     */
    writeCacheEntry(cacheKey: string, content: string): Promise<void>;
}



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

/**
 * Explanation for this higher order typings:
 * https://spin.atomicobject.com/2019/01/11/typescript-higher-order-functions/
 *
 * Note: Can't type return type of this function typing to JsonValue, because normal interface ModuleLink[] is not assignable to JsonValue,
 * because index signature for string is missing. (Problem: I don't want to allow arbitrary indexes on ModuleLink)
 * Todo: maybe find better typing to allow this in type-fest library!
 */
export type CurryInputFunction = (
    ...args: any[]
) => any | Promise<any>;



/**
 * Explanation for this higher order typings:
 * https://spin.atomicobject.com/2019/01/11/typescript-higher-order-functions/
 */
export type CurryOutputFunction = <T extends CurryInputFunction>(
    argsForCurryInputFunction: Parameters<T>,
    options?: CacheAccessOptions,
) => Promise<ReturnType<T>>;
