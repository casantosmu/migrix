export async function ensureMigrationsTable(client, tableName) {
  try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          name VARCHAR PRIMARY KEY,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
  } catch (error) {
    throw new Error(`Failed to create ${tableName} table: ${error.message}`);
  }
}
