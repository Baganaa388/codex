import { ZodSchema, ZodError } from 'zod';
import { AppError } from '@/lib/errors';

export function validateBody<T>(body: unknown, schema: ZodSchema<T>): T {
  try {
    return schema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      throw new AppError(messages.join('; '), 400);
    }
    throw err;
  }
}
