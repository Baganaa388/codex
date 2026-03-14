import { ContestRepository } from '@/lib/repositories/contest.repository';
import { Contest } from '@/lib/types';
import { AppError } from '@/lib/errors';

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
      description?: string;
      start_time: string;
      end_time: string;
      status?: string;
      location_name?: string;
      location_address?: string;
      latitude?: number | null;
      longitude?: number | null;
      timeline?: readonly { title: string; desc: string; date: string }[];
      registration_fee?: number;
    }): Promise<Contest> {
      return contestRepo.create({
        name: data.name,
        description: data.description ?? '',
        start_time: data.start_time,
        end_time: data.end_time,
        status: data.status ?? 'draft',
        location_name: data.location_name ?? '',
        location_address: data.location_address ?? '',
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        timeline: data.timeline ?? [],
        registration_fee: data.registration_fee ?? 0,
      });
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
