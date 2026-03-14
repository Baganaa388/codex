import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { __pool: Pool | undefined };

function stripParams(connStr: string, params: string[]): string {
  const url = new URL(connStr);
  for (const p of params) url.searchParams.delete(p);
  return url.toString();
}

function createPool(): Pool {
  const rawConnStr = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/codex_olympiad';
  const isProduction = process.env.NODE_ENV === 'production';
  const useSSL = isProduction || rawConnStr.includes('neon.tech') || rawConnStr.includes('sslmode=');

  const connStr = useSSL
    ? stripParams(rawConnStr, ['sslmode', 'channel_binding'])
    : rawConnStr;

  return new Pool({
    connectionString: connStr,
    max: isProduction ? 10 : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: useSSL ? { rejectUnauthorized: false } : undefined,
  });
}

export const pool = globalForDb.__pool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__pool = pool;
}
