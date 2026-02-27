import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/api-response';

export function createAuthController(authService: AuthService) {
  return Object.freeze({
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(successResponse(result));
      } catch (err) {
        next(err);
      }
    },
  });
}

export type AuthController = ReturnType<typeof createAuthController>;
