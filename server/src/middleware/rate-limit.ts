import rateLimit from 'express-rate-limit';

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, data: null, error: 'Too many login attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, data: null, error: 'Too many requests, slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});
