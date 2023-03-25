/**
 * This file tests the planetscale storage engine for curryCache
 */

import { load } from "envy";
import { assert, assertEquals } from "std_testing";
import { PlanetscaleStorageEngine } from "../lib/storage/planetscale_storage_engine.ts";

const env = await load();
const host = env["PLANETSCALE_HOST"] ?? "";
const username = env["PLANETSCALE_USER"] ?? "";
const password = env["PLANETSCALE_PASSWD"] ?? "";

Deno.test({
  name: `Planetscale Tests can run when env vars are available `,
  ignore: !host || !username || !password,
  fn: () => {
    assert(true);
  },
});

const storage = new PlanetscaleStorageEngine({
  host,
  username,
  password,
  tableName: "deno_curry_cache_library",
});

Deno.test({
  name: `Test readCache()`,
  ignore: host === "" || username === "" || password === "",
  fn: async () => {
    const result = await storage.readCache();
    console.log(result);
    assert(result);
  },
});

Deno.test({
  name: `Test clearCache()`,
  ignore: host === "" || username === "" || password === "",
  fn: async () => {
    await storage.clearCache();
    const result = await storage.readCache();

    console.log(result);
    assert(result !== undefined);
    assert(Object.keys(result).length === 0);
  },
});

Deno.test({
  name: `Test writeCacheEntry & readCacheEntry`,
  ignore: host === "" || username === "" || password === "",
  fn: async () => {
    const testKey = "cacheKey-Test1";
    const testValue = "Test writeCacheEntry";
    await storage.writeCacheEntry(testKey, testValue);

    const response = await storage.readCacheEntry(testKey);
    assertEquals(response, testValue);

    // cleanup
    await storage.clearCache();
  },
});

Deno.test({
  name: `Test writeCache`,
  ignore: host === "" || username === "" || password === "",
  fn: async () => {
    const cacheObject = {
      "massCacheTest1": "massCacheTest1",
      "massCacheTest2": "massCacheTest2",
      "massCacheTest3": "massCacheTest3",
    };

    await storage.writeCache(cacheObject);

    const response = await storage.readCache();
    assertEquals(response, cacheObject);

    // cleanup
    await storage.clearCache();
  },
});
