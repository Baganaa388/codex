import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contestantId = Number(searchParams.get('id'));
    if (!contestantId) {
      return new NextResponse('SUCCESS', { status: 200 });
    }

    const contestant = await services.contestantRepo.findById(contestantId);
    if (!contestant || !contestant.qpay_invoice_id) {
      return new NextResponse('SUCCESS', { status: 200 });
    }

    const result = await services.qpayService.checkPayment(contestant.qpay_invoice_id);
    const paidRow = result.rows?.find(r => r.payment_status === 'PAID');

    if (paidRow) {
      await services.contestantRepo.updatePayment(contestant.id, {
        payment_status: 'paid',
        paid_at: new Date(),
      });
    }

    return new NextResponse('SUCCESS', { status: 200 });
  } catch (err) {
    console.error('QPay callback error:', err);
    return new NextResponse('SUCCESS', { status: 200 });
  }
}
