import { createContestantService } from '../../src/services/contestant.service';
import { AppError } from '../../src/middleware/error-handler';

describe('contestant.service', () => {
  const mockContest = {
    id: 1,
    name: 'Codex 2026',
    description: '',
    start_time: new Date(),
    end_time: new Date(),
    status: 'registration' as const,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockContestant = {
    id: 1,
    contest_id: 1,
    reg_number: 'CX4-0001',
    first_name: 'Бат',
    last_name: 'Дорж',
    email: 'bat@test.com',
    phone: '99001122',
    organization: 'МУИС',
    category: 'Ахлах' as const,
    created_at: new Date(),
  };

  describe('register', () => {
    it('should register a new contestant', async () => {
      const mockContestantRepo = {
        findByContestId: jest.fn(),
        findByRegNumber: jest.fn(),
        findById: jest.fn(),
        findDuplicate: jest.fn().mockResolvedValue(null),
        getNextSequence: jest.fn().mockResolvedValue(1),
        create: jest.fn().mockResolvedValue(mockContestant),
      };
      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(mockContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestantService(mockContestantRepo, mockContestRepo);
      const result = await service.register({
        contest_id: 1,
        first_name: 'Бат',
        last_name: 'Дорж',
        email: 'bat@test.com',
        phone: '99001122',
        organization: 'МУИС',
        category: 'Ахлах',
      });

      expect(result.reg_number).toBe('CX4-0001');
      expect(mockContestantRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ reg_number: 'CX4-0001' }),
      );
    });

    it('should reject duplicate email', async () => {
      const mockContestantRepo = {
        findByContestId: jest.fn(),
        findByRegNumber: jest.fn(),
        findById: jest.fn(),
        findDuplicate: jest.fn().mockResolvedValue(mockContestant),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };
      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(mockContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestantService(mockContestantRepo, mockContestRepo);

      await expect(service.register({
        contest_id: 1,
        first_name: 'Бат',
        last_name: 'Дорж',
        email: 'bat@test.com',
        phone: '99001122',
        organization: 'МУИС',
        category: 'Ахлах',
      })).rejects.toThrow('Email already registered');
    });

    it('should reject when contest not in registration', async () => {
      const closedContest = { ...mockContest, status: 'finished' as const };
      const mockContestantRepo = {
        findByContestId: jest.fn(),
        findByRegNumber: jest.fn(),
        findById: jest.fn(),
        findDuplicate: jest.fn(),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };
      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(closedContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestantService(mockContestantRepo, mockContestRepo);

      await expect(service.register({
        contest_id: 1,
        first_name: 'Бат',
        last_name: 'Дорж',
        email: 'bat@test.com',
        phone: '99001122',
        organization: 'МУИС',
        category: 'Ахлах',
      })).rejects.toThrow('not accepting registrations');
    });
  });

  describe('lookupByRegNumber', () => {
    it('should return contestant', async () => {
      const mockContestantRepo = {
        findByContestId: jest.fn(),
        findByRegNumber: jest.fn().mockResolvedValue(mockContestant),
        findById: jest.fn(),
        findDuplicate: jest.fn(),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };
      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestantService(mockContestantRepo, mockContestRepo);
      const result = await service.lookupByRegNumber('CX4-0001');

      expect(result.first_name).toBe('Бат');
    });

    it('should throw 404 when not found', async () => {
      const mockContestantRepo = {
        findByContestId: jest.fn(),
        findByRegNumber: jest.fn().mockResolvedValue(null),
        findById: jest.fn(),
        findDuplicate: jest.fn(),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };
      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestantService(mockContestantRepo, mockContestRepo);

      await expect(service.lookupByRegNumber('CX4-9999')).rejects.toThrow(AppError);
    });
  });
});
