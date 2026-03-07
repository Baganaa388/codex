import { config } from '../config/index';
import { AppError } from '../middleware/error-handler';

interface QPayToken {
  readonly token_type: string;
  readonly refresh_expires_in: number;
  readonly refresh_token: string;
  readonly access_token: string;
  readonly expires_in: number;
  readonly scope: string;
  readonly obtained_at: number;
}

interface QPayInvoiceResponse {
  readonly invoice_id: string;
  readonly qr_text: string;
  readonly qr_image: string;
  readonly urls: readonly { name: string; description: string; logo: string; link: string }[];
}

interface QPayPaymentCheckResponse {
  readonly count: number;
  readonly paid_amount: number;
  readonly rows: readonly {
    readonly payment_id: string;
    readonly payment_status: string;
    readonly payment_amount: number;
  }[];
}

let cachedToken: QPayToken | null = null;

function isTokenValid(): boolean {
  if (!cachedToken) return false;
  const now = Math.floor(Date.now() / 1000);
  return now < cachedToken.obtained_at + cachedToken.expires_in - 60;
}

async function getAccessToken(): Promise<string> {
  if (isTokenValid() && cachedToken) {
    return cachedToken.access_token;
  }

  const credentials = Buffer.from(
    `${config.qpayClientId}:${config.qpayClientSecret}`
  ).toString('base64');

  const response = await fetch(`${config.qpayBaseUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('QPay auth failed:', response.status, text);
    throw new AppError('QPay authentication failed', 502);
  }

  const data = await response.json() as Omit<QPayToken, 'obtained_at'>;
  cachedToken = { ...data, obtained_at: Math.floor(Date.now() / 1000) };
  return cachedToken.access_token;
}

export function createQPayService() {
  return Object.freeze({
    async createInvoice(params: {
      invoiceNo: string;
      amount: number;
      description: string;
      callbackParam: string;
    }): Promise<QPayInvoiceResponse> {
      const token = await getAccessToken();

      const body = {
        invoice_code: config.qpayInvoiceCode,
        sender_invoice_no: params.invoiceNo,
        invoice_receiver_code: 'terminal',
        invoice_description: params.description,
        amount: params.amount,
        callback_url: `${config.qpayCallbackUrl}?id=${params.callbackParam}`,
      };

      const response = await fetch(`${config.qpayBaseUrl}/invoice`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('QPay create invoice failed:', response.status, text);
        throw new AppError('QPay invoice creation failed', 502);
      }

      return response.json() as Promise<QPayInvoiceResponse>;
    },

    async checkPayment(invoiceId: string): Promise<QPayPaymentCheckResponse> {
      const token = await getAccessToken();

      const response = await fetch(`${config.qpayBaseUrl}/payment/check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          object_type: 'INVOICE',
          object_id: invoiceId,
          offset: { page_number: 1, page_limit: 100 },
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error('QPay payment check failed:', response.status, text);
        throw new AppError('QPay payment check failed', 502);
      }

      return response.json() as Promise<QPayPaymentCheckResponse>;
    },
  });
}

export type QPayService = ReturnType<typeof createQPayService>;
