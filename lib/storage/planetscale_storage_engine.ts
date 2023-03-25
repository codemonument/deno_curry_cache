import { CurryCacheStorageEngine } from "../types.ts";
import { connect } from "../../deps/planetscale.ts";
import { ensureCacheTable } from "./planetscale_utils.ts";

export type PlanetscaleStorageEngineOptions = {
  /**
   * Planetscale DB Connection Host, User and Password
   */
  host: string;
  username: string;
  password: string;

  /**
   * The Name for the caching table
   */
  tableName: string;
};

/**
 * This Storage engine expects a planetscale table to exist of the form:
 * 
  CREATE TABLE IF NOT EXISTS deno_curry_cache_library (
    cacheKey VARCHAR(250) PRIMARY KEY, 
    value TEXT
  );
 */
export class PlanetscaleStorageEngine
  implements CurryCacheStorageEngine<PlanetscaleStorageEngineOptions> {
  db;

  constructor(public engineOptions: PlanetscaleStorageEngineOptions) {
    this.db = connect(engineOptions);
  }

  async readCacheEntry(cacheKey: string): Promise<string | undefined> {
    await ensureCacheTable(this.db, this.engineOptions.tableName);
    throw new Error("Method not implemented.");
  }
  async readCache(): Promise<Record<string, string> | undefined> {
    await ensureCacheTable(this.db, this.engineOptions.tableName);
    throw new Error("Method not implemented.");
  }
  async clearCache(): Promise<void> {
    await ensureCacheTable(this.db, this.engineOptions.tableName);
    throw new Error("Method not implemented.");
  }
  async writeCache(cacheObject: Record<string, string>): Promise<void> {
    await ensureCacheTable(this.db, this.engineOptions.tableName);
    throw new Error("Method not implemented.");
  }
  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    await ensureCacheTable(this.db, this.engineOptions.tableName);
    throw new Error("Method not implemented.");
  }
}
