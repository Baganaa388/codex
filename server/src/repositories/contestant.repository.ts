import { Pool } from 'pg';
import { Contestant } from '../types';

export function createContestantRepository(pool: Pool) {
  return Object.freeze({
    async findByContestId(contestId: number, options?: {
      category?: string;
      search?: string;
      page?: number;
      limit?: number;
    }): Promise<{ rows: readonly Contestant[]; total: number }> {
      const conditions = ['contest_id = $1'];
      const params: unknown[] = [contestId];
      let paramIndex = 2;

      if (options?.category) {
        conditions.push(`category = $${paramIndex++}`);
        params.push(options.category);
      }

      if (options?.search) {
        conditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR reg_number ILIKE $${paramIndex})`);
        params.push(`%${options.search}%`);
        paramIndex++;
      }

      const where = conditions.join(' AND ');

      const countResult = await pool.query<{ count: string }>(
        `SELECT COUNT(*) as count FROM contestants WHERE ${where}`,
        params,
      );
      const total = parseInt(countResult.rows[0].count, 10);

      const page = options?.page ?? 1;
      const limit = options?.limit ?? 50;
      const offset = (page - 1) * limit;

      const result = await pool.query<Contestant>(
        `SELECT * FROM contestants WHERE ${where}
         ORDER BY created_at DESC
         LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
        [...params, limit, offset],
      );

      return { rows: result.rows, total };
    },

    async findByRegNumber(regNumber: string): Promise<Contestant | null> {
      const result = await pool.query<Contestant>(
        'SELECT * FROM contestants WHERE reg_number = $1',
        [regNumber],
      );
      return result.rows[0] ?? null;
    },

    async findById(id: number): Promise<Contestant | null> {
      const result = await pool.query<Contestant>(
        'SELECT * FROM contestants WHERE id = $1',
        [id],
      );
      return result.rows[0] ?? null;
    },

    async findDuplicate(contestId: number, email: string): Promise<Contestant | null> {
      const result = await pool.query<Contestant>(
        'SELECT * FROM contestants WHERE contest_id = $1 AND email = $2',
        [contestId, email],
      );
      return result.rows[0] ?? null;
    },

    async getNextSequence(contestId: number): Promise<number> {
      const result = await pool.query<{ count: string }>(
        'SELECT COUNT(*) as count FROM contestants WHERE contest_id = $1',
        [contestId],
      );
      return parseInt(result.rows[0].count, 10) + 1;
    },

    async create(data: {
      contest_id: number;
      reg_number: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      organization: string;
      category: string;
    }): Promise<Contestant> {
      const result = await pool.query<Contestant>(
        `INSERT INTO contestants (contest_id, reg_number, first_name, last_name, email, phone, organization, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [data.contest_id, data.reg_number, data.first_name, data.last_name, data.email, data.phone, data.organization, data.category],
      );
      return result.rows[0];
    },
  });
}

export type ContestantRepository = ReturnType<typeof createContestantRepository>;
