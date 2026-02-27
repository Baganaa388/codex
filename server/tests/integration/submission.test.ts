import { createScoringService } from '../../src/services/scoring.service';
import { AppError } from '../../src/middleware/error-handler';

describe('scoring.service - submitResults', () => {
  function createMocks() {
    const mockContestant = {
      id: 1, contest_id: 1, reg_number: 'CX4-0001',
      first_name: 'Бат', last_name: 'Дорж',
      email: 'bat@test.com', phone: '99001122',
      organization: 'МУИС', category: 'Ахлах' as const,
      created_at: new Date(),
    };

    const mockProblem = {
      id: 1, contest_id: 1, title: 'Problem A',
      max_points: 100, sort_order: 0, created_at: new Date(),
    };

    const mockSubtasks = [
      { id: 1, problem_id: 1, label: 'Sub1', points: 20, test_count: 5, sort_order: 0 },
      { id: 2, problem_id: 1, label: 'Sub2', points: 30, test_count: 3, sort_order: 1 },
      { id: 3, problem_id: 1, label: 'Sub3', points: 50, test_count: 10, sort_order: 2 },
    ];

    const mockSubmission = {
      id: 1, contestant_id: 1, problem_id: 1,
      submitted_at: new Date(), total_points: 0,
    };

    const contestantRepo = {
      findByRegNumber: jest.fn().mockResolvedValue(mockContestant),
      findByContestId: jest.fn(),
      findById: jest.fn(),
      findDuplicate: jest.fn(),
      getNextSequence: jest.fn(),
      create: jest.fn(),
    };

    const problemRepo = {
      findByContestId: jest.fn().mockResolvedValue([{ ...mockProblem, subtasks: mockSubtasks }]),
      findById: jest.fn().mockResolvedValue(mockProblem),
      createWithSubtasks: jest.fn(),
      getSubtasksByProblemId: jest.fn().mockResolvedValue(mockSubtasks),
    };

    const submissionRepo = {
      create: jest.fn().mockResolvedValue(mockSubmission),
      updateTotalPoints: jest.fn(),
      createSubtaskScore: jest.fn().mockImplementation((data) => Promise.resolve({ id: 1, ...data })),
      getBestSubtaskScores: jest.fn().mockResolvedValue([
        { subtask_id: 1, best_points: 20 },
        { subtask_id: 2, best_points: 30 },
        { subtask_id: 3, best_points: 50 },
      ]),
      getSubmissionsByContestant: jest.fn(),
      getContestStartTime: jest.fn().mockResolvedValue(new Date('2026-04-15T10:00:00Z')),
    };

    const mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
    } as any;

    return { contestantRepo, problemRepo, submissionRepo, mockPool };
  }

  it('should submit and calculate partial score', async () => {
    const { contestantRepo, problemRepo, submissionRepo, mockPool } = createMocks();

    const service = createScoringService(mockPool, submissionRepo, problemRepo, contestantRepo);

    const result = await service.submitResults({
      reg_number: 'CX4-0001',
      problem_id: 1,
      subtask_results: [
        { subtask_id: 1, passed: true },
        { subtask_id: 2, passed: true },
        { subtask_id: 3, passed: false },
      ],
    });

    expect(result.total_points).toBe(50);
    expect(submissionRepo.createSubtaskScore).toHaveBeenCalledTimes(3);
    expect(submissionRepo.updateTotalPoints).toHaveBeenCalledWith(1, 50);
  });

  it('should submit with all subtasks passed for full score', async () => {
    const { contestantRepo, problemRepo, submissionRepo, mockPool } = createMocks();

    const service = createScoringService(mockPool, submissionRepo, problemRepo, contestantRepo);

    const result = await service.submitResults({
      reg_number: 'CX4-0001',
      problem_id: 1,
      subtask_results: [
        { subtask_id: 1, passed: true },
        { subtask_id: 2, passed: true },
        { subtask_id: 3, passed: true },
      ],
    });

    expect(result.total_points).toBe(100);
  });

  it('should return 0 when all subtasks fail', async () => {
    const { contestantRepo, problemRepo, submissionRepo, mockPool } = createMocks();

    const service = createScoringService(mockPool, submissionRepo, problemRepo, contestantRepo);

    const result = await service.submitResults({
      reg_number: 'CX4-0001',
      problem_id: 1,
      subtask_results: [
        { subtask_id: 1, passed: false },
        { subtask_id: 2, passed: false },
        { subtask_id: 3, passed: false },
      ],
    });

    expect(result.total_points).toBe(0);
  });

  it('should throw when contestant not found', async () => {
    const { problemRepo, submissionRepo, mockPool } = createMocks();
    const contestantRepo = {
      findByRegNumber: jest.fn().mockResolvedValue(null),
      findByContestId: jest.fn(),
      findById: jest.fn(),
      findDuplicate: jest.fn(),
      getNextSequence: jest.fn(),
      create: jest.fn(),
    };

    const service = createScoringService(mockPool, submissionRepo, problemRepo, contestantRepo);

    await expect(service.submitResults({
      reg_number: 'CX4-9999',
      problem_id: 1,
      subtask_results: [{ subtask_id: 1, passed: true }],
    })).rejects.toThrow('Contestant not found');
  });

  it('should throw when problem not found', async () => {
    const { contestantRepo, submissionRepo, mockPool } = createMocks();
    const problemRepo = {
      findByContestId: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      createWithSubtasks: jest.fn(),
      getSubtasksByProblemId: jest.fn(),
    };

    const service = createScoringService(mockPool, submissionRepo, problemRepo, contestantRepo);

    await expect(service.submitResults({
      reg_number: 'CX4-0001',
      problem_id: 999,
      subtask_results: [{ subtask_id: 1, passed: true }],
    })).rejects.toThrow('Problem not found');
  });
});
