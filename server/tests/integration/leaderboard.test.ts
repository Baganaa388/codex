import { createLeaderboardService } from '../../src/services/leaderboard.service';
import { AppError } from '../../src/middleware/error-handler';

describe('leaderboard.service', () => {
  const mockContest = {
    id: 1, name: 'Codex 2026', description: '',
    start_time: new Date(), end_time: new Date(),
    status: 'active' as const, created_at: new Date(), updated_at: new Date(),
  };

  describe('getLeaderboard', () => {
    it('should return leaderboard entries', async () => {
      const entries = [
        {
          rank: 1, reg_number: 'CX4-0001', first_name: 'Бат', last_name: 'Дорж',
          organization: 'МУИС', category: 'Ахлах', total_points: 250, penalty_minutes: 120,
        },
        {
          rank: 2, reg_number: 'CX4-0002', first_name: 'Болд', last_name: 'Сүх',
          organization: 'ШУТИС', category: 'Дунд', total_points: 200, penalty_minutes: 180,
        },
      ];

      const mockPool = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [{ count: '2' }] })
          .mockResolvedValueOnce({ rows: entries }),
      } as any;

      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(mockContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createLeaderboardService(mockPool, mockContestRepo);
      const result = await service.getLeaderboard(1);

      expect(result.entries).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.entries[0].total_points).toBe(250);
    });

    it('should throw 404 for non-existent contest', async () => {
      const mockPool = { query: jest.fn() } as any;
      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(null),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createLeaderboardService(mockPool, mockContestRepo);

      await expect(service.getLeaderboard(999)).rejects.toThrow(AppError);
    });

    it('should filter by category', async () => {
      const mockPool = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [{ count: '1' }] })
          .mockResolvedValueOnce({ rows: [{
            rank: 1, reg_number: 'CX4-0001', first_name: 'Бат', last_name: 'Дорж',
            organization: 'МУИС', category: 'Ахлах', total_points: 250, penalty_minutes: 120,
          }] }),
      } as any;

      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(mockContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createLeaderboardService(mockPool, mockContestRepo);
      const result = await service.getLeaderboard(1, { category: 'Ахлах' });

      expect(result.entries).toHaveLength(1);
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('category'),
        expect.arrayContaining(['Ахлах']),
      );
    });
  });

  describe('getProblemStatistics', () => {
    it('should return problem stats', async () => {
      const stats = [
        { problem_id: 1, title: 'Problem A', max_points: 100, solved_count: 5, avg_points: 60 },
        { problem_id: 2, title: 'Problem B', max_points: 100, solved_count: 2, avg_points: 30 },
      ];

      const mockPool = {
        query: jest.fn().mockResolvedValue({ rows: stats }),
      } as any;

      const mockContestRepo = {
        findAll: jest.fn(),
        findById: jest.fn().mockResolvedValue(mockContest),
        create: jest.fn(),
        update: jest.fn(),
      };

      const service = createLeaderboardService(mockPool, mockContestRepo);
      const result = await service.getProblemStatistics(1);

      expect(result).toHaveLength(2);
      expect(result[0].solved_count).toBe(5);
    });
  });
});
