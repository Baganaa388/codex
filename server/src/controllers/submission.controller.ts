import { Request, Response, NextFunction } from 'express';
import { ScoringService } from '../services/scoring.service';
import { successResponse } from '../utils/api-response';

export function createSubmissionController(scoringService: ScoringService) {
  return Object.freeze({
    async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const submission = await scoringService.submitResults(req.body);
        res.status(201).json(successResponse(submission));
      } catch (err) {
        next(err);
      }
    },
  });
}

export type SubmissionController = ReturnType<typeof createSubmissionController>;
