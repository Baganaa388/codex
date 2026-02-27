import { pool } from '../config/database';
import { config } from '../config/index';
import { hashPassword } from '../utils/password';

async function seed(): Promise<void> {
  const existingAdmin = await pool.query('SELECT id FROM admins WHERE email = $1', [config.adminEmail]);

  if (existingAdmin.rows.length > 0) {
    console.log('Admin already exists, skipping seed.');
    await pool.end();
    return;
  }

  const passwordHash = await hashPassword(config.adminPassword);
  await pool.query(
    'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
    [config.adminEmail, passwordHash],
  );

  console.log(`Admin seeded: ${config.adminEmail}`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
