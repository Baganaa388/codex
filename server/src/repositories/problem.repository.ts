import { Pool } from 'pg';
import { Problem, Subtask, ProblemWithSubtasks } from '../types';

export function createProblemRepository(pool: Pool) {
  return Object.freeze({
    async findByContestId(contestId: number): Promise<readonly ProblemWithSubtasks[]> {
      const problems = await pool.query<Problem>(
        'SELECT * FROM problems WHERE contest_id = $1 ORDER BY sort_order',
        [contestId],
      );

      const result: ProblemWithSubtasks[] = [];
      for (const problem of problems.rows) {
        const subtasks = await pool.query<Subtask>(
          'SELECT * FROM subtasks WHERE problem_id = $1 ORDER BY sort_order',
          [problem.id],
        );
        result.push({ ...problem, subtasks: subtasks.rows });
      }
      return result;
    },

    async findById(id: number): Promise<Problem | null> {
      const result = await pool.query<Problem>(
        'SELECT * FROM problems WHERE id = $1',
        [id],
      );
      return result.rows[0] ?? null;
    },

    async createWithSubtasks(
      contestId: number,
      data: {
        title: string;
        max_points: number;
        sort_order: number;
        subtasks: readonly { label: string; points: number; test_count: number }[];
      },
    ): Promise<ProblemWithSubtasks> {
      const problemResult = await pool.query<Problem>(
        `INSERT INTO problems (contest_id, title, max_points, sort_order)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [contestId, data.title, data.max_points, data.sort_order],
      );
      const problem = problemResult.rows[0];

      const subtasks: Subtask[] = [];
      for (let i = 0; i < data.subtasks.length; i++) {
        const st = data.subtasks[i];
        const stResult = await pool.query<Subtask>(
          `INSERT INTO subtasks (problem_id, label, points, test_count, sort_order)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [problem.id, st.label, st.points, st.test_count, i],
        );
        subtasks.push(stResult.rows[0]);
      }

      return { ...problem, subtasks };
    },

    async getSubtasksByProblemId(problemId: number): Promise<readonly Subtask[]> {
      const result = await pool.query<Subtask>(
        'SELECT * FROM subtasks WHERE problem_id = $1 ORDER BY sort_order',
        [problemId],
      );
      return result.rows;
    },
  });
}

export type ProblemRepository = ReturnType<typeof createProblemRepository>;
