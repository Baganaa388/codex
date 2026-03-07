export interface AppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly databaseUrl: string;
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly adminEmail: string;
  readonly adminPassword: string;
  readonly qpayClientId: string;
  readonly qpayClientSecret: string;
  readonly qpayInvoiceCode: string;
  readonly qpayBaseUrl: string;
  readonly qpayCallbackUrl: string;
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
    qpayClientId: process.env.QPAY_CLIENT_ID ?? '',
    qpayClientSecret: process.env.QPAY_CLIENT_SECRET ?? '',
    qpayInvoiceCode: process.env.QPAY_INVOICE_CODE ?? '',
    qpayBaseUrl: process.env.QPAY_BASE_URL ?? 'https://merchant-sandbox.qpay.mn/v2',
    qpayCallbackUrl: process.env.QPAY_CALLBACK_URL ?? '',
  });
}

export const config = loadConfig();
