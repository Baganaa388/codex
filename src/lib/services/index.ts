import { pool } from '@/lib/db/pool';
import { createAdminRepository } from '@/lib/repositories/admin.repository';
import { createContestRepository } from '@/lib/repositories/contest.repository';
import { createProblemRepository } from '@/lib/repositories/problem.repository';
import { createContestantRepository } from '@/lib/repositories/contestant.repository';
import { createSubmissionRepository } from '@/lib/repositories/submission.repository';
import { createAuthService } from '@/lib/services/auth.service';
import { createContestService } from '@/lib/services/contest.service';
import { createProblemService } from '@/lib/services/problem.service';
import { createContestantService } from '@/lib/services/contestant.service';
import { createScoringService } from '@/lib/services/scoring.service';
import { createLeaderboardService } from '@/lib/services/leaderboard.service';
import { createQPayService } from '@/lib/services/qpay.service';

const globalForServices = globalThis as unknown as {
  __services: ReturnType<typeof createServices> | undefined;
};

function createServices() {
  const adminRepo = createAdminRepository(pool);
  const contestRepo = createContestRepository(pool);
  const problemRepo = createProblemRepository(pool);
  const contestantRepo = createContestantRepository(pool);
  const submissionRepo = createSubmissionRepository(pool);

  return Object.freeze({
    authService: createAuthService(adminRepo),
    contestService: createContestService(contestRepo),
    problemService: createProblemService(problemRepo, contestRepo),
    contestantService: createContestantService(contestantRepo, contestRepo),
    scoringService: createScoringService(pool, submissionRepo, problemRepo, contestantRepo),
    leaderboardService: createLeaderboardService(pool, contestRepo),
    qpayService: createQPayService(),
    contestantRepo,
  });
}

export const services = globalForServices.__services ?? createServices();

if (process.env.NODE_ENV !== 'production') {
  globalForServices.__services = services;
}
