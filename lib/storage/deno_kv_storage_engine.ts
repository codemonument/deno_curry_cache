import { CurryCacheStorageEngine } from "../types.ts";
import { kvsMemoryStorage } from "../../deps/kvs-memory-storage.ts";

export interface DenoKvStorageEngineOptions {
  /**
   * The name for the in-mem kvs
   */
  name: string;
}

const kvPrefix = "curry_cache";

export class DenoKvStorageEngine
  implements CurryCacheStorageEngine<DenoKvStorageEngineOptions> {
  storePromise;

  constructor(
    public readonly engineOptions: DenoKvStorageEngineOptions,
  ) {
    this.storePromise = Deno.openKv();
  }

  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    const store = await this.storePromise;
    await store.set([kvPrefix, cacheKey], content);
  }

  async readCacheEntry(cacheKey: string): Promise<string | undefined> {
    const store = await this.storePromise;
    const res = await store.get([kvPrefix, cacheKey]) ?? undefined;
    if (typeof res.value !== "string") {
      console.error(
        `Deno KV Store returns a non-string value despite only having had string to store before`,
      );
      return undefined;
    }
    return res.value;
  }

  async clearCache(): Promise<void> {
    const store = await this.storePromise;
    await store.delete([kvPrefix]);
  }

  /**
   * @deprecated KVS Memory store has no method of setting the whole cache at once!
   * @throws Error
   */
  async writeCache(cacheObject: Record<string, string>): Promise<void> {
    const store = await this.storePromise;

    const transaciton = store.atomic();

    for (const [key, val] of Object.entries(cacheObject)) {
      transaciton.set([kvPrefix, key], val);
    }

    const res = await transaciton.commit();

    if (res === null) throw new Error(`Error while inserting into Deno KV!`);
  }

  /**
   * @deprecated KVS Memory store has no method of getting the whole cache as an object!
   * @throws Error
   */
  async readCache(): Promise<Record<string, string> | undefined> {
    const store = await this.storePromise;
    const iterator = store.list({prefix: [kvPrefix]})

    store.getMany([kvPrefix])

    for await (const entry of iterator) {

    }


  }
}
