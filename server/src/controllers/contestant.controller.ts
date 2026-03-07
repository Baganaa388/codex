import { Request, Response, NextFunction } from 'express';
import { ContestantService } from '../services/contestant.service';
import { successResponse, paginatedResponse } from '../utils/api-response';

export function createContestantController(contestantService: ContestantService) {
  return Object.freeze({
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestant = await contestantService.register(req.body);
        res.status(201).json(successResponse(contestant));
      } catch (err) {
        next(err);
      }
    },

    async listByContest(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestId = Number(req.query.contest_id);
        if (!contestId) {
          res.status(400).json({ success: false, data: null, error: 'contest_id query param required' });
          return;
        }
        const { category, search, page, limit } = req.query;
        const result = await contestantService.listByContest(contestId, {
          category: category as string | undefined,
          search: search as string | undefined,
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
        });
        res.json(paginatedResponse(
          result.rows,
          result.total,
          page ? Number(page) : 1,
          limit ? Number(limit) : 50,
        ));
      } catch (err) {
        next(err);
      }
    },

    async exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestId = Number(req.query.contest_id);
        if (!contestId) {
          res.status(400).json({ success: false, data: null, error: 'contest_id query param required' });
          return;
        }
        const result = await contestantService.listByContest(contestId, { limit: 10000 });
        const rows = result.rows;

        const escapeCsv = (val: unknown): string => {
          if (val === null || val === undefined) return '';
          const str = String(val);
          if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
          return str;
        };

        const header = ['Дугаар', 'Овог', 'Нэр', 'Имэйл', 'Утас', 'Сургууль', 'Ангилал', 'Төлбөр', 'Бүртгэсэн огноо'];
        const csvRows = rows.map(c => [
          c.reg_number,
          c.last_name,
          c.first_name,
          c.email,
          c.phone,
          c.organization,
          c.category,
          c.payment_status === 'paid' ? 'Төлсөн' : c.payment_status === 'free' ? 'Үнэгүй' : 'Хүлээгдэж буй',
          new Date(c.created_at).toISOString(),
        ].map(escapeCsv).join(','));

        const bom = '\uFEFF';
        const csv = bom + [header.join(','), ...csvRows].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=contestants-${contestId}.csv`);
        res.send(csv);
      } catch (err) {
        next(err);
      }
    },

    async lookupByRegNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const regNumber = String(req.params.regNumber);
        const contestant = await contestantService.lookupByRegNumber(regNumber);
        res.json(successResponse(contestant));
      } catch (err) {
        next(err);
      }
    },
  });
}

export type ContestantController = ReturnType<typeof createContestantController>;
