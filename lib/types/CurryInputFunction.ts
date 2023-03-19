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
