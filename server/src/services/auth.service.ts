import { AdminRepository } from '../repositories/admin.repository';
import { comparePassword } from '../utils/password';
import { generateToken } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';

export function createAuthService(adminRepo: AdminRepository) {
  return Object.freeze({
    async login(email: string, password: string): Promise<{ token: string; admin: { id: number; email: string } }> {
      const admin = await adminRepo.findByEmail(email);
      if (!admin) {
        throw new AppError('Invalid email or password', 401);
      }

      const isValid = await comparePassword(password, admin.password_hash);
      if (!isValid) {
        throw new AppError('Invalid email or password', 401);
      }

      const token = generateToken({ adminId: admin.id, email: admin.email });
      return {
        token,
        admin: { id: admin.id, email: admin.email },
      };
    },
  });
}

export type AuthService = ReturnType<typeof createAuthService>;
