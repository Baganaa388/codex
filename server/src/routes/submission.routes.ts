import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSubmissionSchema } from '../schemas/submission.schema';

export function createSubmissionRoutes(submissionController: SubmissionController): Router {
  const router = Router();

  router.post('/', authMiddleware, validate(createSubmissionSchema), (req, res, next) => {
    submissionController.submit(req, res, next);
  });

  return router;
}
