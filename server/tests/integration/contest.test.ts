import { createContestService } from '../../src/services/contest.service';
import { AppError } from '../../src/middleware/error-handler';

describe('contest.service', () => {
  const mockContest = {
    id: 1,
    name: 'Codex 2026',
    description: 'Test contest',
    start_time: new Date('2026-04-15T10:00:00Z'),
    end_time: new Date('2026-04-15T13:00:00Z'),
    status: 'draft' as const,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe('listContests', () => {
    it('should return all contests', async () => {
      const mockRepo = {
        findAll: jest.fn().mockResolvedValue([mockContest]),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestService(mockRepo);
      const result = await service.listContests();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Codex 2026');
    });
  });

  describe('getContest', () => {
    it('should return contest by id', async () => {
      const mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(mockContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestService(mockRepo);
      const result = await service.getContest(1);

      expect(result.name).toBe('Codex 2026');
    });

    it('should throw 404 when not found', async () => {
      const mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createContestService(mockRepo);

      await expect(service.getContest(999)).rejects.toThrow(AppError);
    });
  });

  describe('createContest', () => {
    it('should create and return contest', async () => {
      const mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn().mockResolvedValue(mockContest),
        update: jest.fn(),
      };

      const service = createContestService(mockRepo);
      const result = await service.createContest({
        name: 'Codex 2026',
        description: 'Test contest',
        start_time: '2026-04-15T10:00:00Z',
        end_time: '2026-04-15T13:00:00Z',
        status: 'draft',
      });

      expect(result.name).toBe('Codex 2026');
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });

  describe('updateContest', () => {
    it('should update and return contest', async () => {
      const updated = { ...mockContest, name: 'Updated' };
      const mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue(updated),
      };

      const service = createContestService(mockRepo);
      const result = await service.updateContest(1, { name: 'Updated' });

      expect(result.name).toBe('Updated');
    });

    it('should throw 404 when contest not found', async () => {
      const mockRepo = {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue(null),
      };

      const service = createContestService(mockRepo);

      await expect(service.updateContest(999, { name: 'X' })).rejects.toThrow(AppError);
    });
  });
});
