export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly databaseUrl: string;
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly adminEmail: string;
  readonly adminPassword: string;
}

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function loadConfig(): AppConfig {
  return Object.freeze({
    port: parseInt(process.env.PORT ?? '4000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    databaseUrl: requireEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/codex_olympiad'),
    jwtSecret: requireEnv('JWT_SECRET', 'dev-secret-change-in-production'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
    adminEmail: process.env.ADMIN_EMAIL ?? 'admin@codex.mn',
    adminPassword: process.env.ADMIN_PASSWORD ?? 'changeme123',
  });
}

export const config = loadConfig();
