import { ProblemRepository } from '@/lib/repositories/problem.repository';
import { ContestRepository } from '@/lib/repositories/contest.repository';
import { ProblemWithSubtasks } from '@/lib/types';
import { AppError } from '@/lib/errors';

export function createProblemService(
  problemRepo: ProblemRepository,
  contestRepo: ContestRepository,
) {
  return Object.freeze({
    async listByContest(contestId: number): Promise<readonly ProblemWithSubtasks[]> {
      const contest = await contestRepo.findById(contestId);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }
      return problemRepo.findByContestId(contestId);
    },

    async createProblem(
      contestId: number,
      data: {
        title: string;
        max_points: number;
        sort_order?: number;
        subtasks: readonly { label: string; points: number; test_count?: number }[];
      },
    ): Promise<ProblemWithSubtasks> {
      const contest = await contestRepo.findById(contestId);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }
      return problemRepo.createWithSubtasks(contestId, data);
    },
  });
}

export type ProblemService = ReturnType<typeof createProblemService>;
