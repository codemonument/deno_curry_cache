/**
 * Tests the "importability" for all dependencies needed for planetscale
 */
import { load } from "envy";

import { connect } from "@/deps/planetscale.ts";
import { assert, assertEquals, assertStrictEquals } from "std_testing";

const env = await load();

Deno.test(`Testing "importability" of planetscale http driver`, () => {
  assert(connect);
});

const host = env["PLANETSCALE_HOST"] ?? "";
const username = env["PLANETSCALE_USER"] ?? "";
const password = env["PLANETSCALE_PASSWD"] ?? "";

Deno.test({
  name: `Testing connection to planetscale`,
  ignore: host === "" || username === "" || password === "",
  fn: async () => {
    const config = {
      host,
      username,
      password,
    };

    const db = connect(config);
    const results = await db.execute("select 1 from dual where 1=?", [1]);
    console.log(results);
  },
});
