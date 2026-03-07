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
  registration_fee: z.number().int().min(0).default(0),
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
  registration_fee: z.number().int().min(0).optional(),
});

export type CreateContestInput = z.infer<typeof createContestSchema>;
export type UpdateContestInput = z.infer<typeof updateContestSchema>;
