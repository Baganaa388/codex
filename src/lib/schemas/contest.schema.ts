import { z } from 'zod';

export const createContestSchema = z.object({
  name: z.string().min(1, 'Contest name is required').max(255),
  description: z.string().default(''),
  start_time: z.string().datetime({ message: 'Invalid start time (ISO 8601 format required)' }),
  end_time: z.string().datetime({ message: 'Invalid end time (ISO 8601 format required)' }),
  status: z.enum(['draft', 'registration', 'active', 'grading', 'finished']).default('draft'),
  location_name: z.string().max(255).default(''),
  location_address: z.string().default(''),
  latitude: z.number().min(-90).max(90).nullable().default(null),
  longitude: z.number().min(-180).max(180).nullable().default(null),
  timeline: z.array(z.object({
    title: z.string().min(1),
    desc: z.string(),
    date: z.string(),
  })).default([]),
  registration_fee: z.number().int().min(0).default(0)
    .refine(v => v === 0 || v >= 5000, { message: 'Хураамж 0 эсвэл ₮5,000-с дээш байх ёстой' }),
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
  location_name: z.string().max(255).optional(),
  location_address: z.string().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  timeline: z.array(z.object({
    title: z.string().min(1),
    desc: z.string(),
    date: z.string(),
  })).optional(),
  registration_fee: z.number().int().min(0)
    .refine(v => v === 0 || v >= 5000, { message: 'Хураамж 0 эсвэл ₮5,000-с дээш байх ёстой' })
    .optional(),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;
export type UpdateContestInput = z.infer<typeof updateContestSchema>;

/* ── Client-side form schemas ──────────────────────── */

export const loginFormSchema = z.object({
  email: z.string().min(1, 'Имэйл оруулна уу').email('Имэйл буруу байна'),
  password: z.string().min(1, 'Нууц үг оруулна уу'),
});
export type LoginFormInput = z.infer<typeof loginFormSchema>;

export const createContestFormSchema = z.object({
  name: z.string().min(1, 'Тэмцээний нэр оруулна уу').max(255),
  description: z.string(),
});
export type CreateContestFormInput = z.infer<typeof createContestFormSchema>;

export const createProblemFormSchema = z.object({
  title: z.string().min(1, 'Бодлогын нэр оруулна уу'),
});
export type CreateProblemFormInput = z.infer<typeof createProblemFormSchema>;

export const scoringFormSchema = z.object({
  reg_number: z.string().min(1, 'Бүртгэлийн дугаар оруулна уу'),
  problem_id: z.number({ invalid_type_error: 'Бодлого сонгоно уу' }).int().positive('Бодлого сонгоно уу'),
});
export type ScoringFormInput = z.infer<typeof scoringFormSchema>;

export const timelineFormSchema = z.object({
  items: z.array(z.object({
    title: z.string().min(1, 'Гарчиг оруулна уу'),
    desc: z.string(),
    date: z.string(),
  })),
});
export type TimelineFormInput = z.infer<typeof timelineFormSchema>;

export const feeFormSchema = z.object({
  registration_fee: z.number({ invalid_type_error: 'Тоо оруулна уу' }).int().min(0, 'Сөрөг байж болохгүй')
    .refine(v => v === 0 || v >= 5000, { message: 'Хамгийн багадаа ₮5,000 эсвэл 0 (үнэгүй)' }),
});
export type FeeFormInput = z.infer<typeof feeFormSchema>;
