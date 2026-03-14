// Server types
export type ContestStatus = 'draft' | 'registration' | 'active' | 'grading' | 'finished';
export type ContestantCategory = 'Бага' | 'Дунд' | 'Ахлах';
export type PaymentStatus = 'pending' | 'paid' | 'free';

export interface Contest {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly start_time: Date;
  readonly end_time: Date;
  readonly status: ContestStatus;
  readonly location_name: string;
  readonly location_address: string;
  readonly latitude: number | null;
  readonly longitude: number | null;
  readonly timeline: readonly { title: string; desc: string; date: string }[];
  readonly registration_fee: number;
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
  readonly payment_status: PaymentStatus;
  readonly qpay_invoice_id: string | null;
  readonly paid_at: Date | null;
  readonly created_at: Date;
}

export interface Submission {
  readonly id: number;
  readonly contestant_id: number;
  readonly problem_id: number;
  readonly submitted_at: Date;
  readonly total_points: number;
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

export interface LeaderboardEntry {
  readonly rank: number;
  readonly reg_number: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly organization: string;
  readonly category: ContestantCategory;
  readonly total_points: number;
  readonly penalty_minutes: number;
  readonly problem_scores: readonly { problem_id: number; points: number }[];
}

export interface ProblemStatistic {
  readonly problem_id: number;
  readonly title: string;
  readonly max_points: number;
  readonly solved_count: number;
  readonly avg_points: number;
}

// Frontend types
export type Category = 'Бага' | 'Дунд' | 'Ахлах';

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: Category;
  organization: string;
  teamName: string;
  languages: string[];
  level: 'Эхлэгч' | 'Дунд' | 'Ахисан';
  agreed: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiLeaderboardEntry {
  rank: number;
  reg_number: string;
  first_name: string;
  last_name: string;
  organization: string;
  category: Category;
  total_points: number;
  penalty_minutes: number;
  problem_scores: { problem_id: number; points: number }[];
}

export interface ApiProblemStat {
  problem_id: number;
  title: string;
  max_points: number;
  solved_count: number;
  avg_points: number;
}
