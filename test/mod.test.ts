import { assert, describe, it } from "std_testing";
import { dummyExport } from "@/mod.ts";

describe(`mod.ts`, () => {
  it(`should export correct objects and types`, () => {
    assert(dummyExport);
  });
});
