import { Pool } from 'pg';
import { config } from './index';

export function createPool(connectionString?: string): Pool {
  const connStr = connectionString ?? config.databaseUrl;
  const isProduction = config.nodeEnv === 'production';

  return new Pool({
    connectionString: connStr,
    max: isProduction ? 10 : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  });
}

export const pool = createPool();

export async function testConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
