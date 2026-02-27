import { z } from 'zod';

const subtaskResult = z.object({
  subtask_id: z.number().int().positive(),
  passed: z.boolean(),
});

export const createSubmissionSchema = z.object({
  reg_number: z.string().regex(/^CX\d-\d{4}$/, 'Invalid registration number format'),
  problem_id: z.number().int().positive(),
  subtask_results: z.array(subtaskResult).min(1, 'At least one subtask result required'),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
