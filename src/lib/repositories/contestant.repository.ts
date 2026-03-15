import { Pool } from 'pg';
import { Contestant } from '@/lib/types';

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
        conditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR reg_number ILIKE $${paramIndex} OR register_number ILIKE $${paramIndex})`);
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

    async findByRegisterNumber(registerNumber: string): Promise<Contestant | null> {
      const result = await pool.query<Contestant>(
        'SELECT * FROM contestants WHERE register_number = $1',
        [registerNumber.trim().toUpperCase()],
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
      register_number: string;
      class_level: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      organization: string;
      category: string;
      payment_status: string;
    }): Promise<Contestant> {
      const result = await pool.query<Contestant>(
        `INSERT INTO contestants (contest_id, reg_number, register_number, class_level, first_name, last_name, email, phone, organization, category, payment_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [data.contest_id, data.reg_number, data.register_number, data.class_level, data.first_name, data.last_name, data.email, data.phone, data.organization, data.category, data.payment_status],
      );
      return result.rows[0];
    },

    async updatePayment(id: number, data: {
      payment_status: string;
      qpay_invoice_id?: string;
      paid_at?: Date;
    }): Promise<Contestant | null> {
      const sets: string[] = ['payment_status = $2'];
      const params: unknown[] = [id, data.payment_status];
      let idx = 3;
      if (data.qpay_invoice_id !== undefined) {
        sets.push(`qpay_invoice_id = $${idx++}`);
        params.push(data.qpay_invoice_id);
      }
      if (data.paid_at !== undefined) {
        sets.push(`paid_at = $${idx++}`);
        params.push(data.paid_at);
      }
      const result = await pool.query<Contestant>(
        `UPDATE contestants SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        params,
      );
      return result.rows[0] ?? null;
    },
  });
}

export type ContestantRepository = ReturnType<typeof createContestantRepository>;
