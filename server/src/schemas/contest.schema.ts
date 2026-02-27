import { z } from 'zod';

export const createContestSchema = z.object({
  name: z.string().min(1, 'Contest name is required').max(255),
  description: z.string().default(''),
  start_time: z.string().datetime({ message: 'Invalid start time (ISO 8601 format required)' }),
  end_time: z.string().datetime({ message: 'Invalid end time (ISO 8601 format required)' }),
  status: z.enum(['draft', 'registration', 'active', 'grading', 'finished']).default('draft'),
}).refine(data => new Date(data.end_time) > new Date(data.start_time), {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const updateContestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  start_time: z.string().datetime().optional(),
  end_time: z.string().datetime().optional(),
  status: z.enum(['draft', 'registration', 'active', 'grading', 'finished']).optional(),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;
export type UpdateContestInput = z.infer<typeof updateContestSchema>;
