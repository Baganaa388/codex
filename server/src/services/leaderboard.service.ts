import { Pool } from 'pg';
import { ContestRepository } from '../repositories/contest.repository';
import { LeaderboardEntry, ProblemStatistic } from '../types';
import { AppError } from '../middleware/error-handler';

export function createLeaderboardService(pool: Pool, contestRepo: ContestRepository) {
  return Object.freeze({
    async getLeaderboard(
      contestId: number,
      options?: { category?: string; search?: string; page?: number; limit?: number },
    ): Promise<{ entries: readonly LeaderboardEntry[]; total: number }> {
      const contest = await contestRepo.findById(contestId);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }

      const conditions = ['lc.contest_id = $1'];
      const params: unknown[] = [contestId];
      let paramIndex = 2;

      if (options?.category) {
        conditions.push(`c.category = $${paramIndex++}`);
        params.push(options.category);
      }

      if (options?.search) {
        conditions.push(`(c.first_name ILIKE $${paramIndex} OR c.last_name ILIKE $${paramIndex} OR c.reg_number ILIKE $${paramIndex} OR c.organization ILIKE $${paramIndex})`);
        params.push(`%${options.search}%`);
        paramIndex++;
      }

      const where = conditions.join(' AND ');

      const countResult = await pool.query<{ count: string }>(
        `SELECT COUNT(*) as count
         FROM leaderboard_cache lc
         JOIN contestants c ON c.id = lc.contestant_id
         WHERE ${where}`,
        params,
      );
      const total = parseInt(countResult.rows[0].count, 10);

      const page = options?.page ?? 1;
      const limit = options?.limit ?? 50;
      const offset = (page - 1) * limit;

      const result = await pool.query<LeaderboardEntry>(
        `SELECT
           RANK() OVER (ORDER BY lc.total_points DESC, lc.penalty_minutes ASC) as rank,
           c.reg_number,
           c.first_name,
           c.last_name,
           c.organization,
           c.category,
           lc.total_points,
           lc.penalty_minutes
         FROM leaderboard_cache lc
         JOIN contestants c ON c.id = lc.contestant_id
         WHERE ${where}
         ORDER BY lc.total_points DESC, lc.penalty_minutes ASC
         LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
        [...params, limit, offset],
      );

      return { entries: result.rows, total };
    },

    async getProblemStatistics(contestId: number): Promise<readonly ProblemStatistic[]> {
      const contest = await contestRepo.findById(contestId);
      if (!contest) {
        throw new AppError('Contest not found', 404);
      }

      const result = await pool.query<ProblemStatistic>(
        `SELECT
           p.id as problem_id,
           p.title,
           p.max_points,
           COUNT(DISTINCT CASE WHEN best.total = p.max_points THEN best.contestant_id END)::int as solved_count,
           COALESCE(AVG(best.total), 0)::int as avg_points
         FROM problems p
         LEFT JOIN (
           SELECT s.contestant_id, s.problem_id,
             SUM(best_sub.best_points) as total
           FROM (
             SELECT DISTINCT contestant_id, problem_id FROM submissions
           ) s
           CROSS JOIN LATERAL (
             SELECT ss.subtask_id, MAX(ss.points_awarded) as best_points
             FROM subtask_scores ss
             JOIN submissions sub ON sub.id = ss.submission_id
             WHERE sub.contestant_id = s.contestant_id AND sub.problem_id = s.problem_id
             GROUP BY ss.subtask_id
           ) best_sub
           GROUP BY s.contestant_id, s.problem_id
         ) best ON best.problem_id = p.id
         WHERE p.contest_id = $1
         GROUP BY p.id, p.title, p.max_points
         ORDER BY p.sort_order`,
        [contestId],
      );

      return result.rows;
    },
  });
}

export type LeaderboardService = ReturnType<typeof createLeaderboardService>;
