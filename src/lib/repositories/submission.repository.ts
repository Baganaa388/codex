import { Pool } from 'pg';
import { Submission } from '@/lib/types';

export function createSubmissionRepository(pool: Pool) {
  return Object.freeze({
    async upsertScore(contestantId: number, problemId: number, score: number): Promise<Submission> {
      const result = await pool.query<Submission>(
        `INSERT INTO submissions (contestant_id, problem_id, total_points)
         VALUES ($1, $2, $3)
         ON CONFLICT (contestant_id, problem_id)
         DO UPDATE SET total_points = $3, submitted_at = NOW()
         RETURNING *`,
        [contestantId, problemId, score],
      );
      return result.rows[0];
    },

    async getSubmissionsByContestant(
      contestantId: number,
      problemId: number,
    ): Promise<readonly Submission[]> {
      const result = await pool.query<Submission>(
        `SELECT * FROM submissions
         WHERE contestant_id = $1 AND problem_id = $2
         ORDER BY submitted_at DESC`,
        [contestantId, problemId],
      );
      return result.rows;
    },

    async getContestStartTime(contestId: number): Promise<Date | null> {
      const result = await pool.query<{ start_time: Date }>(
        'SELECT start_time FROM contests WHERE id = $1',
        [contestId],
      );
      return result.rows[0]?.start_time ?? null;
    },
  });
}

export type SubmissionRepository = ReturnType<typeof createSubmissionRepository>;
