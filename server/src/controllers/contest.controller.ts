import { Request, Response, NextFunction } from 'express';
import { ContestService } from '../services/contest.service';
import { successResponse } from '../utils/api-response';

export function createContestController(contestService: ContestService) {
  return Object.freeze({
    async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contests = await contestService.listContests();
        res.json(successResponse(contests));
      } catch (err) {
        next(err);
      }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contest = await contestService.getContest(Number(req.params.id));
        res.json(successResponse(contest));
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contest = await contestService.createContest(req.body);
        res.status(201).json(successResponse(contest));
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contest = await contestService.updateContest(Number(req.params.id), req.body);
        res.json(successResponse(contest));
      } catch (err) {
        next(err);
      }
    },
  });
}

export type ContestController = ReturnType<typeof createContestController>;
