import { z } from 'zod';

const subtaskInput = z.object({
  label: z.string().min(1, 'Subtask label is required'),
  points: z.number().int().positive('Points must be positive'),
  test_count: z.number().int().positive().default(1),
});

export const createProblemSchema = z.object({
  title: z.string().min(1, 'Problem title is required').max(255),
  max_points: z.number().int().positive('Max points must be positive'),
  sort_order: z.number().int().default(0),
  subtasks: z.array(subtaskInput).min(1, 'At least one subtask is required'),
}).refine(data => {
  const subtaskSum = data.subtasks.reduce((sum, s) => sum + s.points, 0);
  return subtaskSum === data.max_points;
}, {
  message: 'Subtask points must sum to max_points',
  path: ['subtasks'],
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
