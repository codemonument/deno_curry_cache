import { LocalFileStorageEngine } from "@/mod.ts";
import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
  assertThrows,
} from "std_testing";

Deno.test(`[LocalFileStorageEngine]`, async (t) => {
  const cachePath = "./test/data/LocalFileStorageEngine.test.json";
  const storageEngine = new LocalFileStorageEngine({
    type: "text",
    forceCacheFilePath: cachePath,
  });

  await t.step(`Can create instance with forceCacheFile`, () => {
    assertExists(storageEngine);
  });

  await t.step(
    `LocalFileStorageEngine Constructor throws on option - type: 'binary'`,
    () => {
      assertThrows(() => new LocalFileStorageEngine({ type: "binary" }));
    },
  );

  await t.step(`writeCache creates cache file with no records`, async () => {
    await storageEngine.writeCache({});
    assert(await Deno.stat(cachePath));
  });

  await t.step(`readCache reads cache file with no records`, async () => {
    const cacheRecords = await storageEngine.readCache();
    assertEquals(cacheRecords, {});
  });

  await t.step(`clearCache removes cache file`, async () => {
    await storageEngine.clearCache();
    assertRejects(() => Deno.stat(cachePath));
  });

  await t.step(
    `readCache returns undefined when cache is missing`,
    async () => {
      const cacheRecords = await storageEngine.readCache();
      assertEquals(cacheRecords, undefined);
    },
  );

  await t.step(
    `readCacheEntry returns undefined when cache is missing`,
    async () => {
      const cacheEntry = await storageEngine.readCacheEntry("demoKey");
      assertEquals(cacheEntry, undefined);
    },
  );

  await t.step(
    `writeCacheEntry can write one demo entry to cache`,
    () => storageEngine.writeCacheEntry("demoKey", "demoContent"),
  );

  await t.step(
    `writeCacheEntry can append a second demo entry to cache`,
    async () => {
      await storageEngine.writeCacheEntry("secondKey", "secondContent");
      const cacheRecords = await storageEngine.readCache();
      assertEquals(Object.entries(cacheRecords).length, 2);
    },
  );

  await t.step(`readCacheEntry can read a specific key`, async () => {
    const cacheEntry = await storageEngine.readCacheEntry(`secondKey`);
    assertEquals(cacheEntry, "secondContent");
  });
});
