import { Pool } from 'pg';
import { Submission, SubtaskScore } from '../types';

export function createSubmissionRepository(pool: Pool) {
  return Object.freeze({
    async create(contestantId: number, problemId: number): Promise<Submission> {
      const result = await pool.query<Submission>(
        `INSERT INTO submissions (contestant_id, problem_id)
         VALUES ($1, $2)
         RETURNING *`,
        [contestantId, problemId],
      );
      return result.rows[0];
    },

    async updateTotalPoints(submissionId: number, totalPoints: number): Promise<void> {
      await pool.query(
        'UPDATE submissions SET total_points = $2 WHERE id = $1',
        [submissionId, totalPoints],
      );
    },

    async createSubtaskScore(data: {
      submission_id: number;
      subtask_id: number;
      passed: boolean;
      points_awarded: number;
    }): Promise<SubtaskScore> {
      const result = await pool.query<SubtaskScore>(
        `INSERT INTO subtask_scores (submission_id, subtask_id, passed, points_awarded)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.submission_id, data.subtask_id, data.passed, data.points_awarded],
      );
      return result.rows[0];
    },

    async getBestSubtaskScores(
      contestantId: number,
      problemId: number,
    ): Promise<readonly { subtask_id: number; best_points: number }[]> {
      const result = await pool.query<{ subtask_id: number; best_points: number }>(
        `SELECT ss.subtask_id, MAX(ss.points_awarded) as best_points
         FROM subtask_scores ss
         JOIN submissions s ON s.id = ss.submission_id
         WHERE s.contestant_id = $1 AND s.problem_id = $2
         GROUP BY ss.subtask_id`,
        [contestantId, problemId],
      );
      return result.rows;
    },

    async getSubmissionsByContestant(
      contestantId: number,
      problemId: number,
    ): Promise<readonly Submission[]> {
      const result = await pool.query<Submission>(
        `SELECT * FROM submissions
         WHERE contestant_id = $1 AND problem_id = $2
         ORDER BY submitted_at DESC`,
        [contestantId, problemId],
      );
      return result.rows;
    },

    async getContestStartTime(contestId: number): Promise<Date | null> {
      const result = await pool.query<{ start_time: Date }>(
        'SELECT start_time FROM contests WHERE id = $1',
        [contestId],
      );
      return result.rows[0]?.start_time ?? null;
    },
  });
}

export type SubmissionRepository = ReturnType<typeof createSubmissionRepository>;
