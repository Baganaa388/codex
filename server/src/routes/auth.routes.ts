import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { loginSchema } from '../schemas/auth.schema';
import { loginRateLimit } from '../middleware/rate-limit';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/login', loginRateLimit, validate(loginSchema), (req, res, next) => {
    authController.login(req, res, next);
  });

  return router;
}
