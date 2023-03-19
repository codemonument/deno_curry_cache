import { assert, describe, it } from "std_testing";
import { curryCache, LocalFileStorageEngine, LocalJsonDbStorageEngine } from "@/mod.ts";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(curryCache);
    assert(LocalFileStorageEngine);
    assert(LocalJsonDbStorageEngine);
  });
});
