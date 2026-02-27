import { successResponse, errorResponse, paginatedResponse } from '../../src/utils/api-response';

describe('api-response', () => {
  describe('successResponse', () => {
    it('should return a frozen success response with data', () => {
      const result = successResponse({ id: 1, name: 'test' });

      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'test' },
        error: null,
      });
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('should include meta when provided', () => {
      const result = successResponse([1, 2, 3], { total: 10, page: 1, limit: 3 });

      expect(result.meta).toEqual({ total: 10, page: 1, limit: 3 });
    });

    it('should not include meta when not provided', () => {
      const result = successResponse('data');

      expect(result).not.toHaveProperty('meta');
    });
  });

  describe('errorResponse', () => {
    it('should return a frozen error response', () => {
      const result = errorResponse('Something went wrong');

      expect(result).toEqual({
        success: false,
        data: null,
        error: 'Something went wrong',
      });
      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe('paginatedResponse', () => {
    it('should return a response with pagination meta', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = paginatedResponse(data, 100, 2, 10);

      expect(result).toEqual({
        success: true,
        data,
        error: null,
        meta: { total: 100, page: 2, limit: 10 },
      });
      expect(Object.isFrozen(result)).toBe(true);
    });
  });
});
