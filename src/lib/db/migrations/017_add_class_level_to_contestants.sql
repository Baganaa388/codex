ALTER TABLE contestants
ADD COLUMN IF NOT EXISTS class_level VARCHAR(20);

UPDATE contestants
SET class_level = ''
WHERE class_level IS NULL;

ALTER TABLE contestants
ALTER COLUMN class_level SET NOT NULL;
