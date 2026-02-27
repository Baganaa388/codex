import { Pool } from 'pg';
import { Contest } from '../types';

export function createContestRepository(pool: Pool) {
  return Object.freeze({
    async findAll(): Promise<readonly Contest[]> {
      const result = await pool.query<Contest>(
        'SELECT * FROM contests ORDER BY start_time DESC',
      );
      return result.rows;
    },

    async findById(id: number): Promise<Contest | null> {
      const result = await pool.query<Contest>(
        'SELECT * FROM contests WHERE id = $1',
        [id],
      );
      return result.rows[0] ?? null;
    },

    async create(data: {
      name: string;
      description: string;
      start_time: string;
      end_time: string;
      status: string;
    }): Promise<Contest> {
      const result = await pool.query<Contest>(
        `INSERT INTO contests (name, description, start_time, end_time, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.name, data.description, data.start_time, data.end_time, data.status],
      );
      return result.rows[0];
    },

    async update(id: number, data: Record<string, unknown>): Promise<Contest | null> {
      const entries = Object.entries(data).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return this.findById(id);

      const sets = entries.map(([key], i) => `${key} = $${i + 2}`);
      const values = entries.map(([, v]) => v);

      const result = await pool.query<Contest>(
        `UPDATE contests SET ${sets.join(', ')}, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [id, ...values],
      );
      return result.rows[0] ?? null;
    },
  });
}

export type ContestRepository = ReturnType<typeof createContestRepository>;
