import { z } from 'zod';

export const createSubmissionSchema = z.object({
  reg_number: z.string().regex(/^CX\d+-\d{4}$/, 'Invalid registration number format'),
  problem_id: z.number().int().positive(),
  score: z.number().int().min(0).max(100),
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
