import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/services';
import { validateBody } from '@/lib/middleware/validate';
import { loginSchema } from '@/lib/schemas/auth.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = validateBody(body, loginSchema);
    const result = await services.authService.login(email, password);
    return NextResponse.json({ success: true, data: result, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
