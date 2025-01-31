import fs from "node:fs";
import path from "node:path";

export async function createMigration(name, options) {
  const migrationName = `${Date.now()}_${name}`;

  try {
    fs.mkdirSync(options.dir, { recursive: true });

    fs.writeFileSync(path.join(options.dir, `${migrationName}_up.sql`), "");
    fs.writeFileSync(path.join(options.dir, `${migrationName}_down.sql`), "");

    console.log(`Migration created: ${migrationName}`);
  } catch (error) {
    console.error("Error creating migration:", error);
    process.exit(1);
  }
}
