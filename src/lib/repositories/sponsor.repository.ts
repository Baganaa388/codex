import { Pool } from 'pg';

export interface SponsorRow {
  readonly id: number;
  readonly name: string;
  readonly logo_url: string;
  readonly description: string;
  readonly detail: string;
  readonly website: string;
  readonly founded: string;
  readonly focus: string;
  readonly tier: 'gold' | 'silver' | 'bronze';
  readonly sort_order: number;
  readonly created_at: Date;
}

export function createSponsorRepository(pool: Pool) {
  return Object.freeze({
    async findAll(): Promise<readonly SponsorRow[]> {
      const result = await pool.query<SponsorRow>('SELECT * FROM sponsors ORDER BY sort_order');
      return result.rows;
    },

    async create(data: {
      name: string;
      logo_url: string;
      description?: string;
      detail?: string;
      website?: string;
      founded?: string;
      focus?: string;
      tier?: string;
      sort_order?: number;
    }): Promise<SponsorRow> {
      const result = await pool.query<SponsorRow>(
        `INSERT INTO sponsors (name, logo_url, description, detail, website, founded, focus, tier, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          data.name, data.logo_url, data.description ?? '', data.detail ?? '',
          data.website ?? '', data.founded ?? '', data.focus ?? '',
          data.tier ?? 'gold', data.sort_order ?? 0,
        ],
      );
      return result.rows[0];
    },

    async deleteById(id: number): Promise<void> {
      await pool.query('DELETE FROM sponsors WHERE id = $1', [id]);
    },
  });
}

export type SponsorRepository = ReturnType<typeof createSponsorRepository>;
