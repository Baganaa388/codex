import { ContestantRepository } from '@/lib/repositories/contestant.repository';
import { ContestRepository } from '@/lib/repositories/contest.repository';
import { Contestant } from '@/lib/types';
import { AppError } from '@/lib/errors';
import { generateRegNumber } from '@/lib/utils/registration-id';

export function createContestantService(
  contestantRepo: ContestantRepository,
  contestRepo: ContestRepository,
) {
  return Object.freeze({
    async register(data: {
      contest_id: number;
      register_number: string;
      class_level: string;
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

      const duplicateRegisterNumber = await contestantRepo.findByRegisterNumber(data.register_number);
      if (duplicateRegisterNumber) {
        throw new AppError('Register number already registered', 409);
      }

      const sequence = await contestantRepo.getNextSequence(data.contest_id);
      const regNumber = generateRegNumber(sequence, data.contest_id);

      const paymentStatus = contest.registration_fee > 0 ? 'pending' : 'free';

      return contestantRepo.create({
        ...data,
        register_number: data.register_number.trim().toUpperCase(),
        class_level: data.class_level.trim(),
        reg_number: regNumber,
        payment_status: paymentStatus,
      });
    },

    async registerByAdmin(data: {
      contest_id: number;
      register_number: string;
      class_level: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      organization: string;
      category: string;
      payment_status: 'pending' | 'paid' | 'free';
    }): Promise<Contestant> {
      const contest = await contestRepo.findById(data.contest_id);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }

      const duplicate = await contestantRepo.findDuplicate(data.contest_id, data.email);
      if (duplicate) {
        throw new AppError('Email already registered for this contest', 409);
      }

      const duplicateRegisterNumber = await contestantRepo.findByRegisterNumber(data.register_number);
      if (duplicateRegisterNumber) {
        throw new AppError('Register number already registered', 409);
      }

      const sequence = await contestantRepo.getNextSequence(data.contest_id);
      const regNumber = generateRegNumber(sequence, data.contest_id);

      const contestant = await contestantRepo.create({
        ...data,
        register_number: data.register_number.trim().toUpperCase(),
        class_level: data.class_level.trim(),
        reg_number: regNumber,
      });

      if (data.payment_status === 'paid') {
        const updated = await contestantRepo.updatePayment(contestant.id, {
          payment_status: 'paid',
          paid_at: new Date(),
        });
        if (!updated) {
          throw new AppError('Contestant not found', 404);
        }
        return updated;
      }

      if (data.payment_status !== contestant.payment_status) {
        const updated = await contestantRepo.updatePayment(contestant.id, {
          payment_status: data.payment_status,
        });
        if (!updated) {
          throw new AppError('Contestant not found', 404);
        }
        return updated;
      }

      return contestant;
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

    async updatePaymentStatus(id: number, paymentStatus: 'pending' | 'paid' | 'free'): Promise<Contestant> {
      const contestant = await contestantRepo.findById(id);
      if (!contestant) {
        throw new AppError('Contestant not found', 404);
      }

      const updated = await contestantRepo.updatePayment(id, {
        payment_status: paymentStatus,
        paid_at: paymentStatus === 'paid' ? new Date() : undefined,
      });

      if (!updated) {
        throw new AppError('Contestant not found', 404);
      }

      return updated;
    },
  });
}

export type ContestantService = ReturnType<typeof createContestantService>;
