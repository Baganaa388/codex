import { z } from 'zod';

export const registerContestantSchema = z.object({
  contest_id: z.number().int().positive(),
  register_number: z.string().min(1, 'Register number is required').max(20),
  class_level: z.string().min(1, 'Class level is required').max(20),
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

export const adminCreateContestantSchema = z.object({
  contest_id: z.number().int().positive(),
  register_number: z.string().min(1, 'Register number is required').max(20),
  class_level: z.string().min(1, 'Class level is required').max(20),
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required').max(20),
  organization: z.string().min(1, 'Organization is required').max(255),
  category: z.enum(['Бага', 'Дунд', 'Ахлах']),
  payment_status: z.enum(['pending', 'paid', 'free']).default('pending'),
});

export const updateContestantPaymentSchema = z.object({
  payment_status: z.enum(['pending', 'paid', 'free']),
});

export type AdminCreateContestantInput = z.infer<typeof adminCreateContestantSchema>;
export type UpdateContestantPaymentInput = z.infer<typeof updateContestantPaymentSchema>;
