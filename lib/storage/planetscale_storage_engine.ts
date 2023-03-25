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
  table;

  constructor(public engineOptions: PlanetscaleStorageEngineOptions) {
    this.db = connect({
      host: engineOptions.host,
      username: engineOptions.username,
      password: engineOptions.password,
    });
    this.table = engineOptions.tableName;
  }

  async readCacheEntry(cacheKey: string): Promise<string | undefined> {
    const result = await this.db.execute(
      `SELECT * FROM ${this.table} WHERE cacheKey=?`,
      [cacheKey],
      {
        // as object: e.g. {col1:string, val1: ???}[]
        // as array: e.g. [string, string][]
        as: "array",
      },
    );

    const typedRows = result.rows as [string, string][];
    if (typedRows.length === 0) return undefined;
    return typedRows[0][1];
  }

  /**
   * CAUTION: Can possibly contain A shitload of data!
   * @returns The full cache as Record<string, string>
   */
  async readCache(): Promise<Record<string, string> | undefined> {
    const result = await this.db.execute(`SELECT * FROM ${this.table}`, {
      as: "array",
    });

    const cache: Record<string, string> = {};

    for (const row of result.rows) {
      const typedRow = row as { cacheKey: string; value: string };
      cache[typedRow.cacheKey] = typedRow.value;
    }

    return cache;
  }

  async clearCache(): Promise<void> {
    await this.db.execute(`TRUNCATE TABLE ${this.table}`);
  }

  async writeCache(cacheObject: Record<string, string>): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    await this.db.execute(
      `INSERT INTO ${this.table} (cacheKey, value)
     VALUES (? , ?)`,
      [cacheKey, content],
    );
  }
}
