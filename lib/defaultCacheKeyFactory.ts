import { CacheKeyParts } from "./types/CacheKeyParts.ts";
import "https://raw.githubusercontent.com/puleos/object-hash/master/dist/object_hash.js";

//@ts-ignore: oject_hash is a global variable when using the browser variant
const objectHash: any = globalThis.objectHash;

export function defaultCacheKeyFactory(
  { inputFunctionName, inputFunctionArgs, customCacheKeyPostfix }:
    CacheKeyParts,
): string {
  const cacheKeyArray = [inputFunctionName];

  try {
    const inputArgsHash = objectHash(inputFunctionArgs);
    cacheKeyArray.push(inputArgsHash);
  } catch (_error) {
    console.warn(
      `[defaultCacheKeyFactory] - failed to calculate objectHash(cacheKeyParts.inputFunctionArgs) - not using it for cacheKey`,
    );
  }

  if (customCacheKeyPostfix) {
    cacheKeyArray.push(customCacheKeyPostfix);
  }

  return cacheKeyArray.join("_");
}
