import { Pool } from 'pg';

export interface Slide {
  readonly id: number;
  readonly image_url: string;
  readonly title: string;
  readonly sort_order: number;
  readonly created_at: Date;
}

export function createSlideRepository(pool: Pool) {
  return Object.freeze({
    async findAll(): Promise<readonly Slide[]> {
      const result = await pool.query<Slide>('SELECT * FROM slides ORDER BY sort_order');
      return result.rows;
    },

    async create(data: { image_url: string; title?: string; sort_order?: number }): Promise<Slide> {
      const result = await pool.query<Slide>(
        `INSERT INTO slides (image_url, title, sort_order) VALUES ($1, $2, $3) RETURNING *`,
        [data.image_url, data.title ?? '', data.sort_order ?? 0],
      );
      return result.rows[0];
    },

    async deleteById(id: number): Promise<void> {
      await pool.query('DELETE FROM slides WHERE id = $1', [id]);
    },
  });
}

export type SlideRepository = ReturnType<typeof createSlideRepository>;
