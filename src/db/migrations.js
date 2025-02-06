export async function ensureMigrationsTable(client, tableName) {
  try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER GENERATED ALWAYS AS IDENTITY,
          name VARCHAR UNIQUE NOT NULL,
          timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
  } catch (error) {
    throw new Error(`Failed to create ${tableName} table: ${error.message}`);
  }
}
