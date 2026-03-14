import { Pool } from 'pg';
import { Problem } from '@/lib/types';

export function createProblemRepository(pool: Pool) {
  return Object.freeze({
    async findByContestId(contestId: number): Promise<readonly Problem[]> {
      const result = await pool.query<Problem>(
        'SELECT * FROM problems WHERE contest_id = $1 ORDER BY sort_order',
        [contestId],
      );
      return result.rows;
    },

    async findById(id: number): Promise<Problem | null> {
      const result = await pool.query<Problem>(
        'SELECT * FROM problems WHERE id = $1',
        [id],
      );
      return result.rows[0] ?? null;
    },

    async create(
      contestId: number,
      data: { title: string; max_points: number; sort_order?: number },
    ): Promise<Problem> {
      const result = await pool.query<Problem>(
        `INSERT INTO problems (contest_id, title, max_points, sort_order)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [contestId, data.title, data.max_points, data.sort_order ?? 0],
      );
      return result.rows[0];
    },

    async deleteById(id: number): Promise<void> {
      await pool.query('DELETE FROM problems WHERE id = $1', [id]);
    },
  });
}

export type ProblemRepository = ReturnType<typeof createProblemRepository>;
