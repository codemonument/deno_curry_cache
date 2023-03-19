import { CacheAccessOptions } from "./CacheAccessOptions.ts";
import { CurryInputFunction } from "./CurryInputFunction.ts";

/**
 * Explanation for this higher order typings:
 * https://spin.atomicobject.com/2019/01/11/typescript-higher-order-functions/
 */
export type CurryOutputFunction = <T extends CurryInputFunction>(
  argsForCurryInputFunction: Parameters<T>,
  options?: CacheAccessOptions,
) => Promise<ReturnType<T>>;
