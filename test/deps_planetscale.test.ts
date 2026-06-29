/**
 * Tests the "importability" for all dependencies needed for planetscale
 */
import { connect } from "@/deps/planetscale.ts";
import { assert, assertEquals, assertStrictEquals } from "std_testing";

Deno.test(`Testing "importability" of planetscale http driver`, () => {
  assert(connect);
});

const host = Deno.env.get("PLANETSCALE_HOST") ?? "";
const username = Deno.env.get("PLANETSCALE_USER") ?? "";
const password = Deno.env.get("PLANETSCALE_PASSWD") ?? "";

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
