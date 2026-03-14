import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/services';
import { AppError } from '@/lib/errors';
import { handleRouteError } from '@/lib/utils/route-handler';

export async function POST(
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
      throw new AppError('Already paid', 400);
    }

    if (contestant.payment_status === 'free') {
      throw new AppError('No payment required', 400);
    }

    const contest = await services.contestService.getContest(contestant.contest_id);

    if (contest.registration_fee <= 0) {
      throw new AppError('No payment required for this contest', 400);
    }

    const invoice = await services.qpayService.createInvoice({
      invoiceNo: contestant.reg_number,
      amount: contest.registration_fee,
      description: `${contest.name} - ${contestant.first_name} ${contestant.last_name} бүртгэлийн төлбөр`,
      callbackParam: String(contestant.id),
    });

    await services.contestantRepo.updatePayment(contestant.id, {
      payment_status: 'pending',
      qpay_invoice_id: invoice.invoice_id,
    });

    return NextResponse.json({
      success: true,
      data: {
        invoice_id: invoice.invoice_id,
        qr_image: invoice.qr_image,
        qr_text: invoice.qr_text,
        urls: invoice.urls,
        amount: contest.registration_fee,
      },
      error: null,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
