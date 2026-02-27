import { Pool } from 'pg';
import { SubmissionRepository } from '../repositories/submission.repository';
import { ProblemRepository } from '../repositories/problem.repository';
import { ContestantRepository } from '../repositories/contestant.repository';
import { AppError } from '../middleware/error-handler';
import { Submission } from '../types';

export function createScoringService(
  pool: Pool,
  submissionRepo: SubmissionRepository,
  problemRepo: ProblemRepository,
  contestantRepo: ContestantRepository,
) {
  return Object.freeze({
    async submitResults(data: {
      reg_number: string;
      problem_id: number;
      subtask_results: readonly { subtask_id: number; passed: boolean }[];
    }): Promise<Submission> {
      const contestant = await contestantRepo.findByRegNumber(data.reg_number);
      if (!contestant) {
        throw new AppError('Contestant not found', 404);
      }

      const problem = await problemRepo.findById(data.problem_id);
      if (!problem) {
        throw new AppError('Problem not found', 404);
      }

      if (problem.contest_id !== contestant.contest_id) {
        throw new AppError('Problem does not belong to contestant\'s contest', 400);
      }

      const subtasks = await problemRepo.getSubtasksByProblemId(data.problem_id);
      const subtaskMap = new Map(subtasks.map(st => [st.id, st]));

      for (const result of data.subtask_results) {
        if (!subtaskMap.has(result.subtask_id)) {
          throw new AppError(`Subtask ${result.subtask_id} not found for this problem`, 400);
        }
      }

      const submission = await submissionRepo.create(contestant.id, data.problem_id);

      let submissionTotal = 0;
      for (const result of data.subtask_results) {
        const subtask = subtaskMap.get(result.subtask_id)!;
        const pointsAwarded = result.passed ? subtask.points : 0;
        submissionTotal += pointsAwarded;

        await submissionRepo.createSubtaskScore({
          submission_id: submission.id,
          subtask_id: result.subtask_id,
          passed: result.passed,
          points_awarded: pointsAwarded,
        });
      }

      await submissionRepo.updateTotalPoints(submission.id, submissionTotal);

      await this.updateLeaderboard(contestant.id, contestant.contest_id);

      return { ...submission, total_points: submissionTotal };
    },

    async calculateBestScore(contestantId: number, problemId: number): Promise<number> {
      const bestScores = await submissionRepo.getBestSubtaskScores(contestantId, problemId);
      return bestScores.reduce((sum, s) => sum + Number(s.best_points), 0);
    },

    async updateLeaderboard(contestantId: number, contestId: number): Promise<void> {
      const problems = await problemRepo.findByContestId(contestId);
      let totalPoints = 0;

      for (const problem of problems) {
        const bestScore = await this.calculateBestScore(contestantId, problem.id);
        totalPoints += bestScore;
      }

      const penaltyMinutes = await this.calculatePenalty(contestantId, contestId);

      await pool.query(
        `INSERT INTO leaderboard_cache (contest_id, contestant_id, total_points, penalty_minutes, rank, updated_at)
         VALUES ($1, $2, $3, $4, 0, NOW())
         ON CONFLICT (contest_id, contestant_id)
         DO UPDATE SET total_points = $3, penalty_minutes = $4, updated_at = NOW()`,
        [contestId, contestantId, totalPoints, penaltyMinutes],
      );
    },

    async calculatePenalty(contestantId: number, contestId: number): Promise<number> {
      const contestStartTime = await submissionRepo.getContestStartTime(contestId);
      if (!contestStartTime) return 0;

      const result = await pool.query<{ submitted_at: Date; total_points: number; problem_id: number }>(
        `SELECT s.submitted_at, s.total_points, s.problem_id
         FROM submissions s
         JOIN contestants c ON c.id = s.contestant_id
         WHERE s.contestant_id = $1 AND c.contest_id = $2
         ORDER BY s.problem_id, s.submitted_at`,
        [contestantId, contestId],
      );

      let totalPenalty = 0;
      const bestByProblem = new Map<number, number>();

      for (const row of result.rows) {
        const currentBest = bestByProblem.get(row.problem_id) ?? 0;
        if (row.total_points > currentBest) {
          bestByProblem.set(row.problem_id, row.total_points);
          const elapsedMs = new Date(row.submitted_at).getTime() - new Date(contestStartTime).getTime();
          totalPenalty += Math.max(0, Math.floor(elapsedMs / 60000));
        }
      }

      return totalPenalty;
    },

    async recalculateLeaderboard(contestId: number): Promise<void> {
      const contestantsResult = await pool.query<{ id: number }>(
        'SELECT id FROM contestants WHERE contest_id = $1',
        [contestId],
      );

      for (const contestant of contestantsResult.rows) {
        await this.updateLeaderboard(contestant.id, contestId);
      }

      await this.assignRanks(contestId);
    },

    async assignRanks(contestId: number): Promise<void> {
      await pool.query(
        `UPDATE leaderboard_cache lc
         SET rank = ranked.rank
         FROM (
           SELECT id,
             RANK() OVER (ORDER BY total_points DESC, penalty_minutes ASC) as rank
           FROM leaderboard_cache
           WHERE contest_id = $1
         ) ranked
         WHERE lc.id = ranked.id AND lc.contest_id = $1`,
        [contestId],
      );
    },
  });
}

export type ScoringService = ReturnType<typeof createScoringService>;
