import process from "node:process";
import pg from "pg";
const { Client } = pg;

export function createClient(envPath) {
  process.loadEnvFile(envPath);

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  return new Client({
    connectionString: process.env.DATABASE_URL,
  });
}
