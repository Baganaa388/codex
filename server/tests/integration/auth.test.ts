import { createAuthService } from '../../src/services/auth.service';
import { AppError } from '../../src/middleware/error-handler';
import { hashPassword } from '../../src/utils/password';

describe('auth.service', () => {
  it('should return token for valid credentials', async () => {
    const passwordHash = await hashPassword('password123');
    const mockAdminRepo = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'admin@test.com',
        password_hash: passwordHash,
      }),
    };

    const service = createAuthService(mockAdminRepo);
    const result = await service.login('admin@test.com', 'password123');

    expect(result.token).toBeDefined();
    expect(result.admin.email).toBe('admin@test.com');
  });

  it('should throw for non-existent email', async () => {
    const mockAdminRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
    };

    const service = createAuthService(mockAdminRepo);

    await expect(service.login('wrong@test.com', 'password123'))
      .rejects.toThrow(AppError);
  });

  it('should throw for wrong password', async () => {
    const passwordHash = await hashPassword('correct');
    const mockAdminRepo = {
      findByEmail: jest.fn().mockResolvedValue({
        id: 1,
        email: 'admin@test.com',
        password_hash: passwordHash,
      }),
    };

    const service = createAuthService(mockAdminRepo);

    await expect(service.login('admin@test.com', 'wrong'))
      .rejects.toThrow(AppError);
  });
});
