import { createScoringService } from '../../src/services/scoring.service';

describe('scoring.service', () => {
  describe('calculateBestScore', () => {
    it('should sum best subtask scores across submissions', async () => {
      const mockSubmissionRepo = {
        getBestSubtaskScores: jest.fn().mockResolvedValue([
          { subtask_id: 1, best_points: 20 },
          { subtask_id: 2, best_points: 30 },
          { subtask_id: 3, best_points: 50 },
        ]),
        create: jest.fn(),
        updateTotalPoints: jest.fn(),
        createSubtaskScore: jest.fn(),
        getSubmissionsByContestant: jest.fn(),
        getContestStartTime: jest.fn(),
      };

      const mockProblemRepo = {
        findByContestId: jest.fn(),
        findById: jest.fn(),
        createWithSubtasks: jest.fn(),
        getSubtasksByProblemId: jest.fn(),
      };

      const mockContestantRepo = {
        findByRegNumber: jest.fn(),
        findByContestId: jest.fn(),
        findById: jest.fn(),
        findDuplicate: jest.fn(),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };

      const mockPool = { query: jest.fn() } as any;

      const service = createScoringService(
        mockPool,
        mockSubmissionRepo,
        mockProblemRepo,
        mockContestantRepo,
      );

      const result = await service.calculateBestScore(1, 1);
      expect(result).toBe(100);
      expect(mockSubmissionRepo.getBestSubtaskScores).toHaveBeenCalledWith(1, 1);
    });

    it('should return 0 when no scores exist', async () => {
      const mockSubmissionRepo = {
        getBestSubtaskScores: jest.fn().mockResolvedValue([]),
        create: jest.fn(),
        updateTotalPoints: jest.fn(),
        createSubtaskScore: jest.fn(),
        getSubmissionsByContestant: jest.fn(),
        getContestStartTime: jest.fn(),
      };

      const mockPool = { query: jest.fn() } as any;
      const mockProblemRepo = {
        findByContestId: jest.fn(),
        findById: jest.fn(),
        createWithSubtasks: jest.fn(),
        getSubtasksByProblemId: jest.fn(),
      };
      const mockContestantRepo = {
        findByRegNumber: jest.fn(),
        findByContestId: jest.fn(),
        findById: jest.fn(),
        findDuplicate: jest.fn(),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };

      const service = createScoringService(
        mockPool,
        mockSubmissionRepo,
        mockProblemRepo,
        mockContestantRepo,
      );

      const result = await service.calculateBestScore(1, 1);
      expect(result).toBe(0);
    });

    it('should pick the best score per subtask from multiple submissions', async () => {
      const mockSubmissionRepo = {
        getBestSubtaskScores: jest.fn().mockResolvedValue([
          { subtask_id: 1, best_points: 20 },
          { subtask_id: 2, best_points: 0 },
        ]),
        create: jest.fn(),
        updateTotalPoints: jest.fn(),
        createSubtaskScore: jest.fn(),
        getSubmissionsByContestant: jest.fn(),
        getContestStartTime: jest.fn(),
      };

      const mockPool = { query: jest.fn() } as any;
      const mockProblemRepo = {
        findByContestId: jest.fn(),
        findById: jest.fn(),
        createWithSubtasks: jest.fn(),
        getSubtasksByProblemId: jest.fn(),
      };
      const mockContestantRepo = {
        findByRegNumber: jest.fn(),
        findByContestId: jest.fn(),
        findById: jest.fn(),
        findDuplicate: jest.fn(),
        getNextSequence: jest.fn(),
        create: jest.fn(),
      };

      const service = createScoringService(
        mockPool,
        mockSubmissionRepo,
        mockProblemRepo,
        mockContestantRepo,
      );

      const result = await service.calculateBestScore(1, 1);
      expect(result).toBe(20);
    });
  });
});
