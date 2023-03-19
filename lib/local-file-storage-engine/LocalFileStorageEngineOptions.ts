export interface LocalFileStorageEngineOptions {
  type: "text" | "binary";

  /**
   * The folder where cache files with auto-generated names will be saved
   * Can be overwritten by forceCacheFilePath.
   */
  cacheBasePath?: string;

  /**
   * The exact file path (down to the file ending) where the cache file gets written to.
   * If not set, it will be auto-generated from the function name curried by curryCache.
   */
  forceCacheFilePath?: string;
}
