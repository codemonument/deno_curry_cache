import { curryCache, LocalFileStorageEngine } from "@/mod.ts";
import { log } from "@/deps/std.ts";
import { assertEquals } from "std_testing";

/**
 * Init curryCache Storage Engine
 *
 * The base location for caches for this script is set to the ./playground folder
 * to avoid accidental data loss in the repo folder.
 * This is the second cache and it avoids initializing the scraper subsystem altogether.
 */
const storageEngine = new LocalFileStorageEngine({
  type: "text",
  forceCacheFilePath: "./example/data/main.cache.json",
});

let helloWorldCounter = 0;

function helloWorld(variant: "a" | "b" = "a") {
  helloWorldCounter += 1;
  if (variant === "a") return `Hello World ${helloWorldCounter}!`;
  if (variant === "b") return `Hello Bob ${helloWorldCounter}!`;
  return `Hello Default ${helloWorldCounter}`;
}

const cachedHelloWorld = curryCache(helloWorld, {
  storageEngine,
});

try {
  // Example 1: Calling helloWorld 2 times results in "Hello World 1!" and "Hello World 2!"
  let test = [helloWorld(), helloWorld()];
  log.info(test);
  assertEquals(test, [
    "Hello World 1!",
    "Hello World 2!",
  ]);
  // reset counter
  helloWorldCounter = 0;

  // Example 2: Call helloWorld() 2 times through curryCache => should output only 2x "Hello World 1!", due to input params being the same and
  // curry cache returning the cached value for this function invocation
  // CAUTION: Make sure, that no old cache store is available to read for this function, otherwise you may get false results!
  test = [await cachedHelloWorld([]), await cachedHelloWorld([])];
  log.info(test);
  assertEquals(test, [
    "Hello World 1!",
    "Hello World 1!",
  ]);
  // reset counter
  helloWorldCounter = 0;

  // Example 3: Call 1x helloWorld() (without param) and 2x helloWorld('b'), should output
  // => "Hello World 1!" (from first function invocation before)
  // => "Hello Bob 2!" (bc. param has changed and helloWorldCounter will be incremented regardless of mode a or b, so cache key will be different!)
  // => "Hello Bob 2!" (bc. param is the same as second invocation, so cache key will be found!)
  // PROBLEM: Bob has still a count of 1 in the second row, not 2 as expected! :O
  // FIXME: @bjesuiter, look at this later!
  test = [
    await cachedHelloWorld([]),
    await cachedHelloWorld(["b"]),
    await cachedHelloWorld(["b"]),
  ];
  log.info(test);
  assertEquals(test, [
    "Hello World 1!",
    "Hello Bob 1!",
    "Hello Bob 1!",
  ]);

  // reset counter
  helloWorldCounter = 0;

  // TODO: @bjesuiter get rid of this ugly empty array param, which is currently required!
  // const res1 = await cachedHelloWorld([]);
  // console.log(res1);
} catch (error) {
  console.error(error);
  Deno.exit();
}
