import fs from "node:fs";
import path from "node:path";
import { createClient } from "../db/client.js";
import { ensureMigrationsTable } from "../db/migrations.js";

export async function up(options) {
  const client = createClient(options.env);

  try {
    await client.connect();
  } catch (error) {
    console.error("Unable to connect to database:", error.message);
    process.exit(1);
  }

  try {
    await client.query("BEGIN");
    await ensureMigrationsTable(client, options.table);

    const { rows: appliedMigrations } = await client.query(
      `SELECT name FROM ${options.table}`
    );
    const appliedNames = new Set(appliedMigrations.map((m) => m.name));

    const files = fs.readdirSync(options.dir);
    const upFiles = files.filter((f) => f.endsWith("_up.sql")).sort();

    for (const file of upFiles) {
      const migrationName = file.replace("_up.sql", "");

      if (appliedNames.has(migrationName)) {
        continue;
      }

      const sql = fs.readFileSync(path.join(options.dir, file), "utf8");

      try {
        await client.query(sql);
        await client.query(`INSERT INTO ${options.table} (name) VALUES ($1)`, [
          migrationName,
        ]);
        console.log(`Migration applied: ${migrationName}`);
      } catch (error) {
        error.message = `Failed to apply migration '${migrationName}': ${error.message}`;
        throw error;
      }
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error applying migrations:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}
