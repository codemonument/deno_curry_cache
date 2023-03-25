/**
 * Tests the "importability" for all dependencies needed for planetscale
 */

import { connect } from "@/deps/planetscale.ts";
import { assert } from "std_testing";

Deno.test(`Testing "importability" of planetscale http driver`, () => {
  assert(connect);
});
