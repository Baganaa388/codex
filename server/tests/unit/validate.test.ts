import { validate } from '../../src/middleware/validate';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

describe('validate middleware', () => {
  const schema = z.object({
    name: z.string().min(1),
    age: z.number().int().positive(),
  });

  const mockNext = jest.fn() as NextFunction;

  function createMockRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() for valid data', () => {
    const req = { body: { name: 'Test', age: 25 } } as Request;
    const res = createMockRes();

    validate(schema)(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 400 for invalid data', () => {
    const req = { body: { name: '', age: -1 } } as Request;
    const res = createMockRes();

    validate(schema)(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should include field paths in error messages', () => {
    const req = { body: { name: '' } } as Request;
    const res = createMockRes();

    validate(schema)(req, res, mockNext);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining('name'),
      }),
    );
  });
});
