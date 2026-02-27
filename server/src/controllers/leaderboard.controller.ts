import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';
import { ScoringService } from '../services/scoring.service';
import { successResponse, paginatedResponse } from '../utils/api-response';

export function createLeaderboardController(
  leaderboardService: LeaderboardService,
  scoringService: ScoringService,
) {
  return Object.freeze({
    async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestId = Number(req.params.contestId);
        const { category, search, page, limit } = req.query;
        const result = await leaderboardService.getLeaderboard(contestId, {
          category: category as string | undefined,
          search: search as string | undefined,
          page: page ? Number(page) : undefined,
          limit: limit ? Number(limit) : undefined,
        });
        res.json(paginatedResponse(
          result.entries,
          result.total,
          page ? Number(page) : 1,
          limit ? Number(limit) : 50,
        ));
      } catch (err) {
        next(err);
      }
    },

    async getProblemStatistics(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestId = Number(req.params.contestId);
        const stats = await leaderboardService.getProblemStatistics(contestId);
        res.json(successResponse(stats));
      } catch (err) {
        next(err);
      }
    },

    async recalculate(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestId = Number(req.params.contestId);
        await scoringService.recalculateLeaderboard(contestId);
        res.json(successResponse({ message: 'Leaderboard recalculated' }));
      } catch (err) {
        next(err);
      }
    },
  });
}

export type LeaderboardController = ReturnType<typeof createLeaderboardController>;
