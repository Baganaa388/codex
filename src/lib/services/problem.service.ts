import { ProblemRepository } from '@/lib/repositories/problem.repository';
import { ContestRepository } from '@/lib/repositories/contest.repository';
import { Problem } from '@/lib/types';
import { AppError } from '@/lib/errors';

export function createProblemService(
  problemRepo: ProblemRepository,
  contestRepo: ContestRepository,
) {
  return Object.freeze({
    async listByContest(contestId: number): Promise<readonly Problem[]> {
      const contest = await contestRepo.findById(contestId);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }
      return problemRepo.findByContestId(contestId);
    },

    async createProblem(
      contestId: number,
      data: { title: string; max_points: number; sort_order?: number },
    ): Promise<Problem> {
      const contest = await contestRepo.findById(contestId);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }
      return problemRepo.create(contestId, data);
    },

    async deleteProblem(problemId: number): Promise<void> {
      const problem = await problemRepo.findById(problemId);
      if (!problem) {
        throw new AppError('Problem not found', 404);
      }
      await problemRepo.deleteById(problemId);
    },
  });
}

export type ProblemService = ReturnType<typeof createProblemService>;
