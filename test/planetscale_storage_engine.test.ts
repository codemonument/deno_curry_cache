/**
 * This file tests the planetscale storage engine for curryCache
 */

import "https://deno.land/x/dot_env@0.2.0/load.ts";
import { assert } from "std_testing";

const dbHost = Deno.env.get("PLANETSCALE_HOST");
const dbUser = Deno.env.get("PLANETSCALE_USER");
const dbPasswd = Deno.env.get("PLANETSCALE_PASSWD");

Deno.test({
  name: `Planetscale Tests can run when env vars are available `,
  ignore: !dbHost || !dbUser || !dbPasswd,
  fn: () => {
    assert(true);
  },
});
