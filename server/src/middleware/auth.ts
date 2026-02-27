import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { errorResponse } from '../utils/api-response';

export interface AuthPayload {
  readonly adminId: number;
  readonly email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json(errorResponse('Authentication required'));
    return;
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    req.admin = payload;
    next();
  } catch {
    res.status(401).json(errorResponse('Invalid or expired token'));
  }
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(
    { ...payload } as object,
    config.jwtSecret as jwt.Secret,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions,
  );
}
