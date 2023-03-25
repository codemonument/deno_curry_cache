// loads .env file
import "https://deno.land/x/dot_env@0.2.0/load.ts";

import { assert, describe, it } from "std_testing";
import {
  curryCache,
  KvsMemoryStorageEngine,
  LocalFileStorageEngine,
} from "@/mod.ts";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(curryCache);
    assert(LocalFileStorageEngine);
    assert(KvsMemoryStorageEngine);
  });
});
