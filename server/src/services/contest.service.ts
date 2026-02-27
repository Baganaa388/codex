import { ContestRepository } from '../repositories/contest.repository';
import { Contest } from '../types';
import { AppError } from '../middleware/error-handler';

export function createContestService(contestRepo: ContestRepository) {
  return Object.freeze({
    async listContests(): Promise<readonly Contest[]> {
      return contestRepo.findAll();
    },

    async getContest(id: number): Promise<Contest> {
      const contest = await contestRepo.findById(id);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }
      return contest;
    },

    async createContest(data: {
      name: string;
      description: string;
      start_time: string;
      end_time: string;
      status: string;
    }): Promise<Contest> {
      return contestRepo.create(data);
    },

    async updateContest(id: number, data: Record<string, unknown>): Promise<Contest> {
      const contest = await contestRepo.update(id, data);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }
      return contest;
    },
  });
}

export type ContestService = ReturnType<typeof createContestService>;
