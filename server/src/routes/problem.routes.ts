import { Router } from 'express';
import { ProblemController } from '../controllers/problem.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProblemSchema } from '../schemas/problem.schema';

export function createProblemRoutes(problemController: ProblemController): Router {
  const router = Router();

  router.get('/:contestId/problems', (req, res, next) => {
    problemController.listByContest(req, res, next);
  });

  router.post('/:contestId/problems', authMiddleware, validate(createProblemSchema), (req, res, next) => {
    problemController.create(req, res, next);
  });

  return router;
}
