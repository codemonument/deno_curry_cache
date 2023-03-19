import { CurryCacheStorageEngine } from "../types/CurryCacheStorageEngine.ts";
import { LocalJsonDbStorageEngineOptions } from "./LocalJsonDbStorageEngineOptions.ts";

export class LocalJsonDbStorageEngine
  implements CurryCacheStorageEngine<LocalJsonDbStorageEngineOptions> {
  constructor(
    public readonly engineOptions: LocalJsonDbStorageEngineOptions,
  ) {
  }
  readCache(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  clearCache(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
