import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

async function seed(): Promise<void> {
  const connStr = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/codex_olympiad';
  const useSSL = connStr.includes('neon.tech') || connStr.includes('sslmode=require');

  const pool = new Pool({
    connectionString: connStr,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });

  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@codex.mn';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'changeme123';

  const existingAdmin = await pool.query('SELECT id FROM admins WHERE email = $1', [adminEmail]);

  if (existingAdmin.rows.length > 0) {
    console.log('Admin already exists, skipping seed.');
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await pool.query(
    'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
    [adminEmail, passwordHash],
  );

  console.log(`Admin seeded: ${adminEmail}`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
