import { AppError, errorHandler } from '../../src/middleware/error-handler';
import { Request, Response, NextFunction } from 'express';

describe('error-handler', () => {
  const mockReq = {} as Request;
  const mockNext = jest.fn() as NextFunction;

  function createMockRes() {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  }

  describe('AppError', () => {
    it('should create an error with statusCode', () => {
      const error = new AppError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('AppError');
    });

    it('should default to 400 status', () => {
      const error = new AppError('Bad request');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError with correct status', () => {
      const res = createMockRes();
      const error = new AppError('Not found', 404);

      errorHandler(error, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        error: 'Not found',
      });
    });

    it('should handle generic Error with 500 status', () => {
      const res = createMockRes();
      const error = new Error('Unexpected');

      errorHandler(error, mockReq, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
