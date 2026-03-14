import { Pool } from 'pg';
import { Contest } from '@/lib/types';

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
      location_name: string;
      location_address: string;
      latitude: number | null;
      longitude: number | null;
      timeline: readonly { title: string; desc: string; date: string }[];
      registration_fee: number;
    }): Promise<Contest> {
      const result = await pool.query<Contest>(
        `INSERT INTO contests (name, description, start_time, end_time, status, location_name, location_address, latitude, longitude, timeline, registration_fee)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [data.name, data.description, data.start_time, data.end_time, data.status, data.location_name, data.location_address, data.latitude, data.longitude, JSON.stringify(data.timeline), data.registration_fee],
      );
      return result.rows[0];
    },

    async update(id: number, data: Record<string, unknown>): Promise<Contest | null> {
      const entries = Object.entries(data).filter(([, v]) => v !== undefined);
      if (entries.length === 0) return this.findById(id);

      const sets = entries.map(([key], i) => `${key} = $${i + 2}`);
      const values = entries.map(([key, v]) => key === 'timeline' ? JSON.stringify(v) : v);

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
