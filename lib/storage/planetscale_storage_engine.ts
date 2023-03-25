import { CurryCacheStorageEngine } from "../types.ts";
import { connect } from "../../deps/planetscale.ts";

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
 *
 * NOTE: The TEXT datatype has space for around 65 000 chars. If you need more, use:
 * - MEDIUMTEXT: at around 16 MiB
 * - LONGTEXT: at around 4 GiB
 * 
 * If you need to change the datatype, use 
   ALTER TABLE deno_curry_cache_library
   MODIFY COLUMN value MEDIUMTEXT;
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
    const sql = [`INSERT INTO ${this.table} (cacheKey, value) 
    VALUES `];
    const sqlRows = [];
    const sqlParams = [];

    for (const [cacheKey, value] of Object.entries(cacheObject)) {
      sqlRows.push(`(?,?)`);
      sqlParams.push(cacheKey, value);
    }

    sql.push(sqlRows.join(`,
    `));
    await this.db.execute(sql.join(""), sqlParams);
  }

  async writeCacheEntry(cacheKey: string, content: string): Promise<void> {
    await this.db.execute(
      `INSERT INTO ${this.table} (cacheKey, value)
     VALUES (? , ?)`,
      [cacheKey, content],
    );
  }
}
