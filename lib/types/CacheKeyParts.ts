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
