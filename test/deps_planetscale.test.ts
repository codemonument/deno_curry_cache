/**
 * Tests the "importability" for all dependencies needed for planetscale
 */

import { Kysely, PlanetScaleDialect } from "@/deps/planetscale.ts";
import { assert } from "std_testing";

Deno.test(`Testing "importability" of kysely and it's planetscale adapter`, () => {
  assert(Kysely);
  assert(PlanetScaleDialect);
});
