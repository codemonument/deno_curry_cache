import { CurryCacheStorageEngine } from "@/mod.ts";

export interface DenoKvStorageEngineOptions {
  /**
   * The name for the Deno.KV store
   */
  name: string;
}

/**
 * Todo: Write unit tests for this implementation!
 * Todo: Test performance of this implementation!
 * Todo: Test correctness of this implementation!
 */
export class DenoKvStorageEngine
  implements CurryCacheStorageEngine<DenoKvStorageEngineOptions> {
  storePromise;

  constructor(
    public readonly engineOptions: DenoKvStorageEngineOptions,
  ) {
    this.storePromise = Deno.openKv();
  }

  async readCacheEntry(cacheKey: string): Promise<string | undefined> {
    const store = await this.storePromise;
    const kvKey = ["curry-cache", this.engineOptions.name, cacheKey];
    const kvResponse = await store.get<string>(kvKey);
    return kvResponse.value ?? undefined;
  }

  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    const store = await this.storePromise;
    const kvKey = ["curry-cache", this.engineOptions.name, cacheKey];
    const kvResponse = await store.set(kvKey, content);

    if (!kvResponse.ok) {
      console.error(
        `Error while writing cache entry into deno kv!`,
        kvResponse,
      );
    }
  }

  async clearCache(): Promise<void> {
    const store = await this.storePromise;
    const kvKey = ["curry-cache", this.engineOptions.name];

    await store.delete(kvKey);
  }

  async readCache(): Promise<Record<string, string> | undefined> {
    const store = await this.storePromise;
    const kvKey = ["curry-cache", this.engineOptions.name];

    const result: Record<string, string> = {};

    for await (const entry of store.list({ prefix: kvKey })) {
      if (typeof entry.value === "string" && typeof entry.key[2] === "string") {
        const cacheKey = entry.key[2];
        result[cacheKey] = entry.value;
      }
    }

    return result;
  }

  async writeCache(cacheObject: Record<string, string>): Promise<void> {
    for (const [cacheKey, content] of Object.entries(cacheObject)) {
      await this.writeCacheEntry(cacheKey, content);
    }
  }
}
