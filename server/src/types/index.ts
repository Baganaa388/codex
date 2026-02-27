export type ContestStatus = 'draft' | 'registration' | 'active' | 'grading' | 'finished';
export type ContestantCategory = 'Бага' | 'Дунд' | 'Ахлах';

export interface Contest {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly start_time: Date;
  readonly end_time: Date;
  readonly status: ContestStatus;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface Problem {
  readonly id: number;
  readonly contest_id: number;
  readonly title: string;
  readonly max_points: number;
  readonly sort_order: number;
  readonly created_at: Date;
}

export interface Subtask {
  readonly id: number;
  readonly problem_id: number;
  readonly label: string;
  readonly points: number;
  readonly test_count: number;
  readonly sort_order: number;
}

export interface Contestant {
  readonly id: number;
  readonly contest_id: number;
  readonly reg_number: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly phone: string;
  readonly organization: string;
  readonly category: ContestantCategory;
  readonly created_at: Date;
}

export interface Submission {
  readonly id: number;
  readonly contestant_id: number;
  readonly problem_id: number;
  readonly submitted_at: Date;
  readonly total_points: number;
}

export interface SubtaskScore {
  readonly id: number;
  readonly submission_id: number;
  readonly subtask_id: number;
  readonly passed: boolean;
  readonly points_awarded: number;
}

export interface LeaderboardCache {
  readonly id: number;
  readonly contest_id: number;
  readonly contestant_id: number;
  readonly total_points: number;
  readonly penalty_minutes: number;
  readonly rank: number;
  readonly updated_at: Date;
}

export interface Admin {
  readonly id: number;
  readonly email: string;
  readonly password_hash: string;
  readonly created_at: Date;
}

export interface ProblemWithSubtasks extends Problem {
  readonly subtasks: readonly Subtask[];
}

export interface LeaderboardEntry {
  readonly rank: number;
  readonly reg_number: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly organization: string;
  readonly category: ContestantCategory;
  readonly total_points: number;
  readonly penalty_minutes: number;
}

export interface ProblemStatistic {
  readonly problem_id: number;
  readonly title: string;
  readonly max_points: number;
  readonly solved_count: number;
  readonly avg_points: number;
}
