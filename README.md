# migrix

Write your database migrations in pure SQL. No ORMs. No query builders. No JavaScript. Just SQL.

## Why?

Most migration tools make you learn their way of writing SQL. But if you already know SQL, why learn something else? migrix lets you use your SQL knowledge directly:

- **Pure SQL files**: Write migrations in the language you already know
- **Zero magic**: What you write is exactly what runs
- **Framework agnostic**: Works with any Node.js project

Currently supports PostgreSQL, with more SQL databases coming soon.

## Installation

Install the package globally:

```bash
npm install -g migrix
```

Or as a development dependency in your project:

```bash
npm install -D migrix
```

## Quick Start

1. Create a `.env` file with your database connection:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   ```

2. Create your first migration:

   ```bash
   migrate create add_users_table
   ```

   This will create two files in your migrations directory:

   - `<timestamp>_<migration-name>_up.sql`: For the changes you want to apply
   - `<timestamp>_<migration-name>_down.sql`: For reverting the changes

3. Write your SQL in the generated files:

   ```sql
   -- migrations/20240130_add_users_table_up.sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) NOT NULL UNIQUE,
     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
   );

   -- migrations/20240130_add_users_table_down.sql
   DROP TABLE users;
   ```

4. Run your migrations:

   ```bash
   migrate up    # Apply pending migrations
   migrate down  # Roll back latest migration
   ```

Need help? Run `migrate --help` for a list of all commands and options.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
