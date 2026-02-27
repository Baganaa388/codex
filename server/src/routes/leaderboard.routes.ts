import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboard.controller';
import { authMiddleware } from '../middleware/auth';

export function createLeaderboardRoutes(leaderboardController: LeaderboardController): Router {
  const router = Router();

  router.get('/:contestId', (req, res, next) => {
    leaderboardController.getLeaderboard(req, res, next);
  });

  router.get('/:contestId/problems', (req, res, next) => {
    leaderboardController.getProblemStatistics(req, res, next);
  });

  router.post('/:contestId/recalculate', authMiddleware, (req, res, next) => {
    leaderboardController.recalculate(req, res, next);
  });

  return router;
}
