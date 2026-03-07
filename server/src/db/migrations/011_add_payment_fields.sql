ALTER TABLE contests
  ADD COLUMN IF NOT EXISTS registration_fee INTEGER DEFAULT 0;

ALTER TABLE contestants
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'free')),
  ADD COLUMN IF NOT EXISTS qpay_invoice_id VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
