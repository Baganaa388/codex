import jwt from 'jsonwebtoken';
import { AppError } from '@/lib/errors';
import { config } from '@/lib/config';

export interface AuthPayload {
  readonly adminId: number;
  readonly email: string;
}

export function verifyAuth(authHeader: string | null): AuthPayload {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.slice(7);

  try {
    return jwt.verify(token, config.jwtSecret) as AuthPayload;
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(
    { ...payload } as object,
    config.jwtSecret as jwt.Secret,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
  );
}
