import { Pool } from 'pg';
import { SubmissionRepository } from '@/lib/repositories/submission.repository';
import { ProblemRepository } from '@/lib/repositories/problem.repository';
import { ContestantRepository } from '@/lib/repositories/contestant.repository';
import { AppError } from '@/lib/errors';
import { Submission } from '@/lib/types';

export function createScoringService(
  pool: Pool,
  submissionRepo: SubmissionRepository,
  problemRepo: ProblemRepository,
  contestantRepo: ContestantRepository,
) {
  return Object.freeze({
    async submitScore(data: {
      reg_number: string;
      problem_id: number;
      score: number;
    }): Promise<Submission> {
      const contestant = await contestantRepo.findByRegNumber(data.reg_number);
      if (!contestant) {
        throw new AppError('Contestant not found', 404);
      }

      const problem = await problemRepo.findById(data.problem_id);
      if (!problem) {
        throw new AppError('Problem not found', 404);
      }

      if (problem.contest_id !== contestant.contest_id) {
        throw new AppError("Problem does not belong to contestant's contest", 400);
      }

      if (data.score > problem.max_points) {
        throw new AppError(`Score cannot exceed ${problem.max_points}`, 400);
      }

      const submission = await submissionRepo.upsertScore(contestant.id, data.problem_id, data.score);
      await this.updateLeaderboard(contestant.id, contestant.contest_id);
      return submission;
    },

    async getScoresForContest(contestId: number): Promise<Record<number, Record<number, number>>> {
      const result = await pool.query<{ contestant_id: number; problem_id: number; total_points: number }>(
        `SELECT s.contestant_id, s.problem_id, s.total_points
         FROM submissions s
         JOIN contestants c ON c.id = s.contestant_id
         WHERE c.contest_id = $1`,
        [contestId],
      );
      const scores: Record<number, Record<number, number>> = {};
      for (const row of result.rows) {
        if (!scores[row.contestant_id]) scores[row.contestant_id] = {};
        scores[row.contestant_id][row.problem_id] = row.total_points;
      }
      return scores;
    },

    async updateLeaderboard(contestantId: number, contestId: number): Promise<void> {
      const result = await pool.query<{ total: number }>(
        `SELECT COALESCE(SUM(s.total_points), 0) as total
         FROM submissions s
         WHERE s.contestant_id = $1`,
        [contestantId],
      );
      const totalPoints = result.rows[0]?.total ?? 0;

      const penaltyMinutes = await this.calculatePenalty(contestantId, contestId);

      await pool.query(
        `INSERT INTO leaderboard_cache (contest_id, contestant_id, total_points, penalty_minutes, rank, updated_at)
         VALUES ($1, $2, $3, $4, 0, NOW())
         ON CONFLICT (contest_id, contestant_id)
         DO UPDATE SET total_points = $3, penalty_minutes = $4, updated_at = NOW()`,
        [contestId, contestantId, totalPoints, penaltyMinutes],
      );
    },

    async calculatePenalty(contestantId: number, contestId: number): Promise<number> {
      const contestStartTime = await submissionRepo.getContestStartTime(contestId);
      if (!contestStartTime) return 0;

      const result = await pool.query<{ submitted_at: Date; problem_id: number }>(
        `SELECT s.submitted_at, s.problem_id
         FROM submissions s
         JOIN contestants c ON c.id = s.contestant_id
         WHERE s.contestant_id = $1 AND c.contest_id = $2 AND s.total_points > 0`,
        [contestantId, contestId],
      );

      let totalPenalty = 0;
      for (const row of result.rows) {
        const elapsedMs = new Date(row.submitted_at).getTime() - new Date(contestStartTime).getTime();
        totalPenalty += Math.max(0, Math.floor(elapsedMs / 60000));
      }
      return totalPenalty;
    },

    async recalculateLeaderboard(contestId: number): Promise<void> {
      const contestantsResult = await pool.query<{ id: number }>(
        'SELECT id FROM contestants WHERE contest_id = $1',
        [contestId],
      );

      for (const contestant of contestantsResult.rows) {
        await this.updateLeaderboard(contestant.id, contestId);
      }

      await this.assignRanks(contestId);
    },

    async assignRanks(contestId: number): Promise<void> {
      await pool.query(
        `UPDATE leaderboard_cache lc
         SET rank = ranked.rank
         FROM (
           SELECT id,
             RANK() OVER (ORDER BY total_points DESC, penalty_minutes ASC) as rank
           FROM leaderboard_cache
           WHERE contest_id = $1
         ) ranked
         WHERE lc.id = ranked.id AND lc.contest_id = $1`,
        [contestId],
      );
    },
  });
}

export type ScoringService = ReturnType<typeof createScoringService>;
