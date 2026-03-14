import { z } from 'zod';

export const registerContestantSchema = z.object({
  contest_id: z.number().int().positive(),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20),
  organization: z.string().min(1, 'Organization is required').max(255),
  category: z.enum(['Бага', 'Дунд', 'Ахлах'], {
    errorMap: () => ({ message: 'Category must be Бага, Дунд, or Ахлах' }),
  }),
});

export type RegisterContestantInput = z.infer<typeof registerContestantSchema>;
