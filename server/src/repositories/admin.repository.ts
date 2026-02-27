import { Pool } from 'pg';
import { Admin } from '../types';

export function createAdminRepository(pool: Pool) {
  return Object.freeze({
    async findByEmail(email: string): Promise<Admin | null> {
      const result = await pool.query<Admin>(
        'SELECT * FROM admins WHERE email = $1',
        [email],
      );
      return result.rows[0] ?? null;
    },
  });
}

export type AdminRepository = ReturnType<typeof createAdminRepository>;
