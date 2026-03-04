
SET client_encoding = 'UTF8';

-- Ensure only CodeX[0..3] contests
DELETE FROM contests WHERE name = 'CodeX[4]';

-- Ensure CodeX[0..3] exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM contests WHERE name = 'CodeX[0]') THEN
    INSERT INTO contests (name, description, start_time, end_time, status)
    VALUES ('CodeX[0]','Test data', '2022-04-15T02:00:00Z','2022-04-15T05:00:00Z','finished');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM contests WHERE name = 'CodeX[1]') THEN
    INSERT INTO contests (name, description, start_time, end_time, status)
    VALUES ('CodeX[1]','Test data', '2023-04-15T02:00:00Z','2023-04-15T05:00:00Z','finished');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM contests WHERE name = 'CodeX[2]') THEN
    INSERT INTO contests (name, description, start_time, end_time, status)
    VALUES ('CodeX[2]','Test data', '2024-04-15T02:00:00Z','2024-04-15T05:00:00Z','finished');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM contests WHERE name = 'CodeX[3]') THEN
    INSERT INTO contests (name, description, start_time, end_time, status)
    VALUES ('CodeX[3]','Test data', '2025-04-15T02:00:00Z','2025-04-15T05:00:00Z','finished');
  END IF;
END$$;

-- Seed 20 contestants per contest if missing
DO $$
DECLARE
  c RECORD;
  prefix TEXT;
  i INT;
  cat TEXT;
BEGIN
  FOR c IN SELECT id, name FROM contests WHERE name IN ('CodeX[0]','CodeX[1]','CodeX[2]','CodeX[3]') LOOP
    IF c.name = 'CodeX[0]' THEN prefix := 'CX0';
    ELSIF c.name = 'CodeX[1]' THEN prefix := 'CX1';
    ELSIF c.name = 'CodeX[2]' THEN prefix := 'CX2';
    ELSE prefix := 'CX3';
    END IF;

    IF (SELECT COUNT(*) FROM contestants WHERE contest_id = c.id) < 20 THEN
      -- Clear existing to avoid duplicates
      DELETE FROM contestants WHERE contest_id = c.id;
      FOR i IN 1..20 LOOP
        IF i % 3 = 1 THEN cat := U&'\0411\0430\0433\0430';
        ELSIF i % 3 = 2 THEN cat := U&'\0414\0443\043D\0434';
        ELSE cat := U&'\0410\0445\043B\0430\0445';
        END IF;
        INSERT INTO contestants (contest_id, reg_number, first_name, last_name, email, phone, organization, category)
        VALUES (
          c.id,
          prefix || '-' || lpad(i::text, 4, '0'),
          'User' || i,
          'Test' || i,
          lower(prefix) || i || '@example.com',
          '9900' || lpad(i::text, 4, '0'),
          'Org' || ((i-1) % 5 + 1),
          cat
        );
      END LOOP;
    END IF;

    -- Refresh leaderboard cache
    DELETE FROM leaderboard_cache WHERE contest_id = c.id;
    INSERT INTO leaderboard_cache (contest_id, contestant_id, total_points, penalty_minutes, rank, updated_at)
    SELECT c.id, id,
      (1000 - (row_number() OVER (ORDER BY id)) * 10) AS total_points,
      (60 + (row_number() OVER (ORDER BY id)) * 3) AS penalty_minutes,
      0, NOW()
    FROM contestants
    WHERE contest_id = c.id;

    UPDATE leaderboard_cache lc
    SET rank = ranked.rank
    FROM (
      SELECT id, RANK() OVER (ORDER BY total_points DESC, penalty_minutes ASC) AS rank
      FROM leaderboard_cache
      WHERE contest_id = c.id
    ) ranked
    WHERE lc.id = ranked.id AND lc.contest_id = c.id;
  END LOOP;
END$$;
