import { Request, Response, NextFunction } from 'express';
import { QPayService } from '../services/qpay.service';
import { ContestantRepository } from '../repositories/contestant.repository';
import { ContestRepository } from '../repositories/contest.repository';
import { successResponse } from '../utils/api-response';
import { AppError } from '../middleware/error-handler';

export function createPaymentController(
  qpayService: QPayService,
  contestantRepo: ContestantRepository,
  contestRepo: ContestRepository,
) {
  return Object.freeze({
    async createInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestantId = Number(req.params.contestantId);
        const contestant = await contestantRepo.findById(contestantId);
        if (!contestant) {
          throw new AppError('Contestant not found', 404);
        }

        if (contestant.payment_status === 'paid') {
          throw new AppError('Already paid', 400);
        }

        if (contestant.payment_status === 'free') {
          throw new AppError('No payment required', 400);
        }

        const contest = await contestRepo.findById(contestant.contest_id);
        if (!contest) {
          throw new AppError('Contest not found', 404);
        }

        if (contest.registration_fee <= 0) {
          throw new AppError('No payment required for this contest', 400);
        }

        const invoice = await qpayService.createInvoice({
          invoiceNo: contestant.reg_number,
          amount: contest.registration_fee,
          description: `${contest.name} - ${contestant.first_name} ${contestant.last_name} бүртгэлийн төлбөр`,
          callbackParam: String(contestant.id),
        });

        await contestantRepo.updatePayment(contestant.id, {
          payment_status: 'pending',
          qpay_invoice_id: invoice.invoice_id,
        });

        res.json(successResponse({
          invoice_id: invoice.invoice_id,
          qr_image: invoice.qr_image,
          qr_text: invoice.qr_text,
          urls: invoice.urls,
          amount: contest.registration_fee,
        }));
      } catch (err) {
        next(err);
      }
    },

    async checkPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const contestantId = Number(req.params.contestantId);
        const contestant = await contestantRepo.findById(contestantId);
        if (!contestant) {
          throw new AppError('Contestant not found', 404);
        }

        if (contestant.payment_status === 'paid') {
          res.json(successResponse({ paid: true }));
          return;
        }

        if (contestant.payment_status === 'free') {
          res.json(successResponse({ paid: true, free: true }));
          return;
        }

        if (!contestant.qpay_invoice_id) {
          res.json(successResponse({ paid: false }));
          return;
        }

        const result = await qpayService.checkPayment(contestant.qpay_invoice_id);
        const paidRow = result.rows?.find(r => r.payment_status === 'PAID');

        if (paidRow) {
          await contestantRepo.updatePayment(contestant.id, {
            payment_status: 'paid',
            paid_at: new Date(),
          });
          res.json(successResponse({ paid: true }));
          return;
        }

        res.json(successResponse({ paid: false }));
      } catch (err) {
        next(err);
      }
    },

    async callback(req: Request, res: Response, _next: NextFunction): Promise<void> {
      try {
        const contestantId = Number(req.query.id);
        if (!contestantId) {
          res.status(200).send('SUCCESS');
          return;
        }

        const contestant = await contestantRepo.findById(contestantId);
        if (!contestant || !contestant.qpay_invoice_id) {
          res.status(200).send('SUCCESS');
          return;
        }

        const result = await qpayService.checkPayment(contestant.qpay_invoice_id);
        const paidRow = result.rows?.find(r => r.payment_status === 'PAID');

        if (paidRow) {
          await contestantRepo.updatePayment(contestant.id, {
            payment_status: 'paid',
            paid_at: new Date(),
          });
        }

        res.status(200).send('SUCCESS');
      } catch (err) {
        console.error('QPay callback error:', err);
        res.status(200).send('SUCCESS');
      }
    },
  });
}

export type PaymentController = ReturnType<typeof createPaymentController>;
