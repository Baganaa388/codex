import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { services } from '@/lib/services';
import { verifyAuth } from '@/lib/middleware/auth';
import { validateBody } from '@/lib/middleware/validate';
import { updateContestantPaymentSchema } from '@/lib/schemas/contestant.schema';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    verifyAuth(request.headers.get('authorization'));
    const { id } = await params;
    const body = await request.json();
    const validated = validateBody(body, updateContestantPaymentSchema);
    const contestant = await services.contestantService.updatePaymentStatus(Number(id), validated.payment_status);
    revalidateTag('contestants', 'minutes');
    return NextResponse.json({ success: true, data: contestant, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
