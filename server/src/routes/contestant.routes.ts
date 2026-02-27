import { Router } from 'express';
import { ContestantController } from '../controllers/contestant.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerContestantSchema } from '../schemas/contestant.schema';

export function createContestantRoutes(contestantController: ContestantController): Router {
  const router = Router();

  router.post('/', validate(registerContestantSchema), (req, res, next) => {
    contestantController.register(req, res, next);
  });

  router.get('/', authMiddleware, (req, res, next) => {
    contestantController.listByContest(req, res, next);
  });

  router.get('/lookup/:regNumber', authMiddleware, (req, res, next) => {
    contestantController.lookupByRegNumber(req, res, next);
  });

  return router;
}
