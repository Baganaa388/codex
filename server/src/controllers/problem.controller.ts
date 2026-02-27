import { Request, Response, NextFunction } from 'express';
import { ProblemService } from '../services/problem.service';
import { successResponse } from '../utils/api-response';

export function createProblemController(problemService: ProblemService) {
  return Object.freeze({
    async listByContest(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const problems = await problemService.listByContest(Number(req.params.contestId));
        res.json(successResponse(problems));
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const problem = await problemService.createProblem(
          Number(req.params.contestId),
          req.body,
        );
        res.status(201).json(successResponse(problem));
      } catch (err) {
        next(err);
      }
    },
  });
}

export type ProblemController = ReturnType<typeof createProblemController>;
