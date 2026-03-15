import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { validateBody } from '@/lib/middleware/validate';
import { adminCreateContestantSchema } from '@/lib/schemas/contestant.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function POST(request: NextRequest) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const body = await request.json();
    const validated = validateBody(body, adminCreateContestantSchema);
    const contestant = await services.contestantService.registerByAdmin({
      ...validated,
      payment_status: validated.payment_status ?? 'pending',
    });
    revalidateTag('contestants', 'minutes');
    return NextResponse.json({ success: true, data: contestant, error: null }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

