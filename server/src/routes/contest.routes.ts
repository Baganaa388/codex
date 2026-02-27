import { Router } from 'express';
import { ContestController } from '../controllers/contest.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createContestSchema, updateContestSchema } from '../schemas/contest.schema';

export function createContestRoutes(contestController: ContestController): Router {
  const router = Router();

  router.get('/', (req, res, next) => {
    contestController.list(req, res, next);
  });

  router.get('/:id', (req, res, next) => {
    contestController.getById(req, res, next);
  });

  router.post('/', authMiddleware, validate(createContestSchema), (req, res, next) => {
    contestController.create(req, res, next);
  });

  router.put('/:id', authMiddleware, validate(updateContestSchema), (req, res, next) => {
    contestController.update(req, res, next);
  });

  return router;
}
