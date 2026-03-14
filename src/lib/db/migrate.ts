import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

async function runMigrations(): Promise<void> {
  const connStr = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/codex_olympiad';
  const useSSL = connStr.includes('neon.tech') || connStr.includes('sslmode=require');

  const pool = new Pool({
    connectionString: connStr,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });

  const migrationsDir = path.join(import.meta.dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Running ${files.length} migrations...`);

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    console.log(`  Running: ${file}`);
    await pool.query(sql);
  }

  console.log('All migrations completed.');
  await pool.end();
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
