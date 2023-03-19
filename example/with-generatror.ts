import { curryCache, LocalFileStorageEngine } from "@/mod.ts";
import { log } from "@/deps/std.ts";

// NOTE: This with-generator.ts example is Work in Progress! (WIP)

/**
 * Init curryCache Storage Engine
 *
 * The base location for caches for this script is set to the ./playground folder
 * to avoid accidental data loss in the repo folder.
 * This is the second cache and it avoids initializing the scraper subsystem altogether.
 */
const storageEngine = new LocalFileStorageEngine({
  type: "text",
  forceCacheFilePath: "./example/main.cache.json",
});

function* helloWorldGenerator() {
  yield "Hello World!";
  yield "Hello World 2!";
  yield "Hello World 3!";
}

const cachedHelloWorld = curryCache(helloWorldGenerator().next, {
  storageEngine,
  overrideCacheKeyFactory: (
    { inputFunctionName }: { inputFunctionName: string },
  ) => inputFunctionName,
});

try {
  // TODO: @bjesuiter get rid of this ugly empty array param, which is currently required!
  const res1 = cachedHelloWorld([]);
  console.log(res1);
  // console.log(helloWorldGenerator().next());
} catch (error) {
  console.error(error);
  Deno.exit();
}
