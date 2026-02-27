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
