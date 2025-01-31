#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { program } from "commander";
import { createMigration } from "./commands/create.js";
import { up } from "./commands/up.js";
import { down } from "./commands/down.js";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "../package.json"), "utf8")
);

program
  .name("migrate")
  .description("SQL Migration CLI Tool")
  .version(packageJson.version)
  .option("-e, --env <path>", "path to .env file", ".env")
  .option("-t, --table <name>", "migrations table name", "schema_migrations")
  .option("-d, --dir <path>", "migrations directory", "./migrations");

program
  .command("create <name>")
  .description("create a new migration")
  .action((name) => {
    const options = program.opts();
    createMigration(name, options);
  });

program
  .command("up")
  .description("run pending migrations")
  .action(() => {
    const options = program.opts();
    up(options);
  });

program
  .command("down")
  .description("roll back latest migration")
  .action(() => {
    const options = program.opts();
    down(options);
  });

program.parse();
