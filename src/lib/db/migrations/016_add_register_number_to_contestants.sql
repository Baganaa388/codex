ALTER TABLE contestants
ADD COLUMN IF NOT EXISTS register_number VARCHAR(20);

UPDATE contestants
SET register_number = CONCAT('LEGACY', id)
WHERE register_number IS NULL;

ALTER TABLE contestants
ALTER COLUMN register_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_contestants_register_number
ON contestants(register_number);
