import { z } from 'zod';

export const createProblemSchema = z.object({
  title: z.string().min(1, 'Problem title is required').max(255),
  max_points: z.number().int().positive('Max points must be positive'),
  sort_order: z.number().int().default(0),
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
