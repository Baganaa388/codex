
SET client_encoding = 'UTF8';

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
  IF NOT EXISTS (SELECT 1 FROM contests WHERE name = 'CodeX[4]') THEN
    INSERT INTO contests (name, description, start_time, end_time, status)
    VALUES ('CodeX[4]','Registration open', '2026-04-15T02:00:00Z','2026-04-15T05:00:00Z','registration');
  END IF;
END$$;

DO $$
DECLARE
  c RECORD;
  prefix TEXT;
BEGIN
  FOR c IN SELECT id, name FROM contests WHERE name IN ('CodeX[0]','CodeX[1]','CodeX[2]','CodeX[3]') LOOP
    IF c.name = 'CodeX[0]' THEN prefix := 'CX0';
    ELSIF c.name = 'CodeX[1]' THEN prefix := 'CX1';
    ELSIF c.name = 'CodeX[2]' THEN prefix := 'CX2';
    ELSE prefix := 'CX3';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM contestants WHERE contest_id = c.id) THEN
      INSERT INTO contestants (contest_id, reg_number, first_name, last_name, email, phone, organization, category)
      VALUES
        (c.id, prefix||'-0001', 'Bat', 'Dorj', prefix||'1@example.com', '99001122', 'MUIS', U&'\0410\0445\043B\0430\0445'),
        (c.id, prefix||'-0002', 'Saruu', 'Bat', prefix||'2@example.com', '99001123', 'SHUTIS', U&'\0414\0443\043D\0434'),
        (c.id, prefix||'-0003', 'Temuulen', 'Naran', prefix||'3@example.com', '99001124', 'SEZIS', U&'\0411\0430\0433\0430'),
        (c.id, prefix||'-0004', 'Anudar', 'Gan', prefix||'4@example.com', '99001125', 'UB', U&'\0410\0445\043B\0430\0445'),
        (c.id, prefix||'-0005', 'Nomin', 'Enkh', prefix||'5@example.com', '99001126', 'Orkhon', U&'\0414\0443\043D\0434');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM leaderboard_cache WHERE contest_id = c.id) THEN
      INSERT INTO leaderboard_cache (contest_id, contestant_id, total_points, penalty_minutes, rank, updated_at)
      SELECT c.id, id,
        CASE WHEN reg_number LIKE prefix||'-0001' THEN 950
             WHEN reg_number LIKE prefix||'-0002' THEN 900
             WHEN reg_number LIKE prefix||'-0003' THEN 840
             WHEN reg_number LIKE prefix||'-0004' THEN 780
             ELSE 720 END,
        CASE WHEN reg_number LIKE prefix||'-0001' THEN 120
             WHEN reg_number LIKE prefix||'-0002' THEN 140
             WHEN reg_number LIKE prefix||'-0003' THEN 180
             WHEN reg_number LIKE prefix||'-0004' THEN 210
             ELSE 260 END,
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
    END IF;
  END LOOP;
END$$;
