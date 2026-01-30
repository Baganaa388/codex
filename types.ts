
export interface LeaderboardEntry {
  rank: number;
  name: string;
  organization: string;
  points: number;
  penalty: string;
  location: string;
  isTop3?: boolean;
}

export interface ProblemStat {
  title: string;
  solvedCount: number;
}

export type Category = 'Ахлах' | 'Оюутан' | 'Нээлттэй';

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
