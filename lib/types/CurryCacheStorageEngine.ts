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
