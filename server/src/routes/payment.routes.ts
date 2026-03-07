import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';

export function createPaymentRoutes(paymentController: PaymentController): Router {
  const router = Router();

  router.post('/:contestantId/invoice', (req, res, next) => {
    paymentController.createInvoice(req, res, next);
  });

  router.get('/:contestantId/check', (req, res, next) => {
    paymentController.checkPayment(req, res, next);
  });

  router.get('/callback', (req, res, next) => {
    paymentController.callback(req, res, next);
  });

  return router;
}
