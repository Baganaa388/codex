import { ContestantRepository } from '../repositories/contestant.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { Contestant } from '../types';
import { AppError } from '../middleware/error-handler';
import { generateRegNumber } from '../utils/registration-id';

export function createContestantService(
  contestantRepo: ContestantRepository,
  contestRepo: ContestRepository,
) {
  return Object.freeze({
    async register(data: {
      contest_id: number;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      organization: string;
      category: string;
    }): Promise<Contestant> {
      const contest = await contestRepo.findById(data.contest_id);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }

      if (contest.status !== 'registration') {
        throw new AppError('Contest is not accepting registrations', 400);
      }

      const duplicate = await contestantRepo.findDuplicate(data.contest_id, data.email);
      if (duplicate) {
        throw new AppError('Email already registered for this contest', 409);
      }

      const sequence = await contestantRepo.getNextSequence(data.contest_id);
      const regNumber = generateRegNumber(sequence);

      return contestantRepo.create({
        ...data,
        reg_number: regNumber,
      });
    },

    async listByContest(contestId: number, options?: {
      category?: string;
      search?: string;
      page?: number;
      limit?: number;
    }): Promise<{ rows: readonly Contestant[]; total: number }> {
      return contestantRepo.findByContestId(contestId, options);
    },

    async lookupByRegNumber(regNumber: string): Promise<Contestant> {
      const contestant = await contestantRepo.findByRegNumber(regNumber);
      if (!contestant) {
        throw new AppError('Contestant not found', 404);
      }
      return contestant;
    },
  });
}

export type ContestantService = ReturnType<typeof createContestantService>;
