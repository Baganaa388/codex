export interface LeaderboardEntry {
  rank: number;
  name: string;
  organization: string;
  points: number;
  penalty: string;
  location: string;
  isTop3?: boolean;
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
}

export interface ProblemStat {
  title: string;
  solvedCount: number;
}

export interface ApiProblemStat {
  problem_id: number;
  title: string;
  max_points: number;
  solved_count: number;
  avg_points: number;
}

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

export interface Contest {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  status: string;
}
