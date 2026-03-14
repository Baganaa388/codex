import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/services';
import { AppError } from '@/lib/errors';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ contestantId: string }> }
) {
  try {
    const { contestantId: id } = await params;
    const contestantId = Number(id);
    const contestant = await services.contestantRepo.findById(contestantId);
    if (!contestant) {
      throw new AppError('Contestant not found', 404);
    }

    if (contestant.payment_status === 'paid') {
      return NextResponse.json({ success: true, data: { paid: true }, error: null });
    }

    if (contestant.payment_status === 'free') {
      return NextResponse.json({ success: true, data: { paid: true, free: true }, error: null });
    }

    if (!contestant.qpay_invoice_id) {
      return NextResponse.json({ success: true, data: { paid: false }, error: null });
    }

    const result = await services.qpayService.checkPayment(contestant.qpay_invoice_id);
    const paidRow = result.rows?.find(r => r.payment_status === 'PAID');

    if (paidRow) {
      await services.contestantRepo.updatePayment(contestant.id, {
        payment_status: 'paid',
        paid_at: new Date(),
      });
      return NextResponse.json({ success: true, data: { paid: true }, error: null });
    }

    return NextResponse.json({ success: true, data: { paid: false }, error: null });
  } catch (error) {
    return handleRouteError(error);
  }
}
