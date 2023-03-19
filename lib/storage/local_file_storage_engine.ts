import { CurryCacheStorageEngine } from "../types.ts";
import { join } from "../../deps/std.ts";

export interface LocalFileStorageEngineOptions {
  type: "text" | "binary";

  /**
   * The folder where cache files with auto-generated names will be saved
   * Can be overwritten by forceCacheFilePath.
   */
  cacheBasePath?: string;

  /**
   * The exact file path (down to the file ending) where the cache file gets written to.
   * If not set, it will be auto-generated from the function name curried by curryCache.
   */
  forceCacheFilePath?: string;
}

export class LocalFileStorageEngine
  implements CurryCacheStorageEngine<LocalFileStorageEngineOptions> {
  private cachePath: string;

  constructor(public readonly engineOptions: LocalFileStorageEngineOptions) {
    if (engineOptions.type !== "text") {
      throw new Error(`[curryCache] Only supports type text for now!`);
    }

    if (!engineOptions.forceCacheFilePath && !engineOptions.cacheBasePath) {
      throw new Deno.errors.InvalidData(
        `[LocalFileStorageEngine-constructor] You need to pass either a cacheBasePath or a forceCacheFilePath in the options object!`,
      );
    }

    this.cachePath = engineOptions.forceCacheFilePath ??
      join(engineOptions.cacheBasePath ?? "./", "CurryCache.json");
  }

  async readCache() {
    try {
      // Todo: Add memoizaion of this file, if too slow
      const cacheRecords = await Deno.readTextFile(this.cachePath);
      const parsedRecords = JSON.parse(cacheRecords);

      return parsedRecords;
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) return undefined;
      // throw error when it's anything other than a NotFound Error
      throw error;
    }
  }

  async readCacheEntry(cacheKey: string): Promise<string | undefined> {
    const parsedRecords = await this.readCache() ?? {};
    return parsedRecords[cacheKey];
  }

  async clearCache(): Promise<void> {
    try {
      await Deno.remove(this.cachePath);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) return;

      // throw error when it's anything other than a NotFound Error
      throw error;
    }
  }

  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    const cacheRecords = await this.readCache() ?? {};
    cacheRecords[cacheKey] = content;
    return this.writeCache(cacheRecords);
  }

  async writeCache(cacheRecords: Record<string, string>): Promise<void> {
    try {
      const cacheString = JSON.stringify(cacheRecords, undefined, `\t`);
      await Deno.writeTextFile(this.cachePath, cacheString, { create: true });
    } catch (error) {
      // throw error when it's anything => write should not fail!
      throw error;
    }
  }
}
