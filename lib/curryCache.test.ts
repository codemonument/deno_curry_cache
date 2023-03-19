import { curryCache } from "./curryCache.ts";
import { assert, assertEquals, assertExists } from "../dependencies/asserts.ts";
import { LocalFileStorageEngine } from "./local-file-storage-engine/LocalFileStorageEngine.ts";

// TODO: convert Deno.test syntax to bdd style (describe & it)
// See: https://deno.com/blog/v1.21#bdd-style-testing
// import {
//   afterEach,
//   beforeEach,
//   beforeAll,
//   describe,
//   it,
// } from "../dependencies/bdd.std.ts";

/**
 * Test function to be used with curryCache
 * @param toWhom
 * @returns
 */
function hello(toWhom: string): string {
  return `Hello ${toWhom}!`;
}

/**
 * Test function to be used with curryCache
 * @param toWhom
 * @returns
 */
function asyncHello(toWhom: string): Promise<string> {
  return Promise.resolve(`Hello ${toWhom}!`);
}

const cacheFilePath = "./playground/curryCache.test.json";
const storageEngine = new LocalFileStorageEngine({
  type: "text",
  forceCacheFilePath: cacheFilePath,
});

Deno.test(`[curryCache]`, async (t) => {
  await t.step(`cache file should be absent`, async () => {
    try {
      await Deno.stat(cacheFilePath);
      console.warn(`
      Cache File available, deleting it: ${cacheFilePath}`);
      await Deno.remove(cacheFilePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) return;
      throw error;
    }
  });

  await t.step(`curries function without throwing`, () => {
    const cachedHello = curryCache(hello, { storageEngine });
    assertExists(cachedHello);
  });

  await t.step(`runs function and creates result cache`, async () => {
    const cachedHello = curryCache(hello, { storageEngine });
    const result = await cachedHello(["World"]);

    assertEquals(result, "Hello World!");

    const fileStats = await Deno.stat(cacheFilePath);
    assert(fileStats.isFile);
  });

  await t.step(`clear existing cache`, async () => {
    const fileStats = await Deno.stat(cacheFilePath);
    assert(fileStats.isFile);
    await storageEngine.clearCache();
  });

  await t.step(
    `uses result from cache without calling original function again`,
    async () => {
      // clear cache file for this test
      await storageEngine.clearCache();
      let callCount = 0;
      const callCounter = () => callCount += 1;
      const cachedCallCounter = curryCache(callCounter, { storageEngine });

      const result1 = await cachedCallCounter([]);
      assertEquals(callCount, 1);
      assertEquals(result1, 1);

      // assert existence of cache file after first cachedCallCounter
      const fileStats = await Deno.stat(cacheFilePath);
      assert(fileStats.isFile);

      // should return the same data as in test 1, because it's cached! :D
      const result2 = await cachedCallCounter([]);
      assertEquals(callCount, 1);
      assertEquals(result2, 1);
    },
  );
});

Deno.test(`[curryCache RegressionTests]`, async (t) => {
  await t.step(`Can curryCache an async method`, async () => {
    const cachedHello = curryCache(asyncHello, { storageEngine });
    assertExists(cachedHello);

    // clear cache file for this test
    await storageEngine.clearCache();
    // first call
    const result = await cachedHello(["World"]);
    assertEquals(result, "Hello World!");

    const fileStats = await Deno.stat(cacheFilePath);
    assert(fileStats.isFile);

    // second call
    const result2 = await cachedHello(["World"]);
    assertEquals(result2, "Hello World!");
  });
});
