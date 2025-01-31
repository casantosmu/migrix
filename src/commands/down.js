import fs from "node:fs";
import path from "node:path";
import { createClient } from "../db/client.js";
import { ensureMigrationsTable } from "../db/migrations.js";

export async function down(options) {
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

    const { rows: migrations } = await client.query(
      `SELECT name FROM ${options.table} ORDER BY executed_at DESC LIMIT 1`
    );

    if (migrations.length === 0) {
      console.log("No migrations to roll back");
      await client.query("COMMIT");
      return;
    }

    const latestMigration = migrations[0];
    const downFile = path.join(options.dir, `${latestMigration.name}_down.sql`);

    if (!fs.existsSync(downFile)) {
      throw new Error(`Down migration file not found: ${downFile}`);
    }

    const sql = fs.readFileSync(downFile, "utf8");

    try {
      await client.query(sql);
      await client.query(`DELETE FROM ${options.table} WHERE name = $1`, [
        latestMigration.name,
      ]);
      console.log(`Migration rolled back: ${latestMigration.name}`);
    } catch (error) {
      error.message = `Failed to roll back migration '${latestMigration.name}': ${error.message}`;
      throw error;
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error rolling back migration:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}
