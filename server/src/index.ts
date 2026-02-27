import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config/index';
import { pool, testConnection } from './config/database';
import { apiRateLimit } from './middleware/rate-limit';
import { errorHandler } from './middleware/error-handler';
import { successResponse } from './utils/api-response';

import { createAdminRepository } from './repositories/admin.repository';
import { createContestRepository } from './repositories/contest.repository';
import { createProblemRepository } from './repositories/problem.repository';
import { createContestantRepository } from './repositories/contestant.repository';
import { createSubmissionRepository } from './repositories/submission.repository';

import { createAuthService } from './services/auth.service';
import { createContestService } from './services/contest.service';
import { createProblemService } from './services/problem.service';
import { createContestantService } from './services/contestant.service';
import { createScoringService } from './services/scoring.service';
import { createLeaderboardService } from './services/leaderboard.service';

import { createAuthController } from './controllers/auth.controller';
import { createContestController } from './controllers/contest.controller';
import { createProblemController } from './controllers/problem.controller';
import { createContestantController } from './controllers/contestant.controller';
import { createSubmissionController } from './controllers/submission.controller';
import { createLeaderboardController } from './controllers/leaderboard.controller';

import { createAuthRoutes } from './routes/auth.routes';
import { createContestRoutes } from './routes/contest.routes';
import { createProblemRoutes } from './routes/problem.routes';
import { createContestantRoutes } from './routes/contestant.routes';
import { createSubmissionRoutes } from './routes/submission.routes';
import { createLeaderboardRoutes } from './routes/leaderboard.routes';

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(apiRateLimit);

  // Repositories
  const adminRepo = createAdminRepository(pool);
  const contestRepo = createContestRepository(pool);
  const problemRepo = createProblemRepository(pool);
  const contestantRepo = createContestantRepository(pool);
  const submissionRepo = createSubmissionRepository(pool);

  // Services
  const authService = createAuthService(adminRepo);
  const contestService = createContestService(contestRepo);
  const problemService = createProblemService(problemRepo, contestRepo);
  const contestantService = createContestantService(contestantRepo, contestRepo);
  const scoringService = createScoringService(pool, submissionRepo, problemRepo, contestantRepo);
  const leaderboardService = createLeaderboardService(pool, contestRepo);

  // Controllers
  const authController = createAuthController(authService);
  const contestController = createContestController(contestService);
  const problemController = createProblemController(problemService);
  const contestantController = createContestantController(contestantService);
  const submissionController = createSubmissionController(scoringService);
  const leaderboardController = createLeaderboardController(leaderboardService, scoringService);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json(successResponse({ status: 'ok', timestamp: new Date().toISOString() }));
  });

  // Routes
  app.use('/api/auth', createAuthRoutes(authController));
  app.use('/api/contests', createContestRoutes(contestController));
  app.use('/api/contests', createProblemRoutes(problemController));
  app.use('/api/contestants', createContestantRoutes(contestantController));
  app.use('/api/submissions', createSubmissionRoutes(submissionController));
  app.use('/api/leaderboard', createLeaderboardRoutes(leaderboardController));

  // Serve frontend in production
  if (config.nodeEnv === 'production') {
    const clientDist = path.join(__dirname, '../../dist');
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // Error handler
  app.use(errorHandler);

  return app;
}

async function main() {
  const connected = await testConnection();
  if (!connected) {
    console.error('Cannot connect to database. Exiting.');
    process.exit(1);
  }
  console.log('Database connected.');

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

main().catch(console.error);
