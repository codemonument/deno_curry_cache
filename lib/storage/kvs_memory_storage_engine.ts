import { CurryCacheStorageEngine } from "../types.ts";
import { kvsMemoryStorage } from "../../deps/kvs-memory-storage.ts";

export interface KvsMemoryStorageEngineOptions {
  /**
   * The name for the in-mem kvs
   */
  name: string;
}

export class KvsMemoryStorageEngine
  implements CurryCacheStorageEngine<KvsMemoryStorageEngineOptions> {
  storePromise;

  constructor(
    public readonly engineOptions: KvsMemoryStorageEngineOptions,
  ) {
    this.storePromise = kvsMemoryStorage({
      name: engineOptions.name,
      version: 1,
    });
  }

  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    const store = await this.storePromise;
    store.set(cacheKey, content);
  }

  async readCacheEntry(cacheKey: string): Promise<string | undefined> {
    const store = await this.storePromise;
    const value = store.get(cacheKey) ?? undefined;
    if (typeof value !== "string") {
      console.error(
        `KVS Memory Store returns a non-string value despite only having had string to store before`,
      );
      return undefined;
    }
    return value;
  }

  async clearCache(): Promise<void> {
    const store = await this.storePromise;
    store.clear();
  }

  /**
   * @deprecated KVS Memory store has no method of setting the whole cache at once!
   * @throws Error
   */
  writeCache(cacheObject: Record<string, string>): Promise<void> {
    throw new Error(
      "KVS Memory store has no method of setting the whole cache at once!",
    );
  }

  /**
   * @deprecated KVS Memory store has no method of getting the whole cache as an object!
   * @throws Error
   */
  readCache(): Promise<Record<string, string> | undefined> {
    throw new Error(
      "KVS Memory store has no method of getting the whole cache as an object!",
    );
  }
}
