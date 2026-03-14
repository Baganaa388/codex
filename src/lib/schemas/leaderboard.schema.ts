import { z } from 'zod';

export const leaderboardQuerySchema = z.object({
  category: z.enum(['Бага', 'Дунд', 'Ахлах']).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
});

export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;
