export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly meta?: {
    readonly total?: number;
    readonly page?: number;
    readonly limit?: number;
  };
}

export function successResponse<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return Object.freeze({
    success: true,
    data,
    error: null,
    ...(meta ? { meta } : {}),
  });
}

export function errorResponse(message: string): ApiResponse<null> {
  return Object.freeze({
    success: false,
    data: null,
    error: message,
  });
}

export function paginatedResponse<T>(
  data: T,
  total: number,
  page: number,
  limit: number,
): ApiResponse<T> {
  return Object.freeze({
    success: true,
    data,
    error: null,
    meta: Object.freeze({ total, page, limit }),
  });
}
