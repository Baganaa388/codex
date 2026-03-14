import { NextResponse } from 'next/server';

function isAppError(error: unknown): error is { message: string; statusCode: number } {
  return (
    error instanceof Error &&
    error.name === 'AppError' &&
    typeof (error as unknown as Record<string, unknown>).statusCode === 'number'
  );
}

export function handleRouteError(error: unknown) {
  if (isAppError(error)) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.statusCode },
    );
  }
  console.error('Unhandled error:', error);
  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 },
  );
}
