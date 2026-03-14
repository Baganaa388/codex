ALTER TABLE contests
  ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb;
