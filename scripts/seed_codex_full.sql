SET client_encoding = 'UTF8';

-- Keep only CodeX[0..3]
DELETE FROM contests
WHERE name NOT IN ('CodeX[0]','CodeX[1]','CodeX[2]','CodeX[3]');

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

DO $$
DECLARE
  c RECORD;
  p RECORD;
  prefix TEXT;
  i INT;
  cat TEXT;
  prob_id INT;
  st1_id INT;
  st2_id INT;
  base1 INT;
  base2 INT;
  points1 INT;
  points2 INT;
  submission_id INT;
BEGIN
  FOR c IN SELECT id, name FROM contests WHERE name IN ('CodeX[0]','CodeX[1]','CodeX[2]','CodeX[3]') LOOP
    -- Clean existing data for contest
    DELETE FROM leaderboard_cache WHERE contest_id = c.id;
    DELETE FROM submissions WHERE contestant_id IN (SELECT id FROM contestants WHERE contest_id = c.id);
    DELETE FROM subtasks WHERE problem_id IN (SELECT id FROM problems WHERE contest_id = c.id);
    DELETE FROM problems WHERE contest_id = c.id;
    DELETE FROM contestants WHERE contest_id = c.id;

    IF c.name = 'CodeX[0]' THEN prefix := 'CX0';
    ELSIF c.name = 'CodeX[1]' THEN prefix := 'CX1';
    ELSIF c.name = 'CodeX[2]' THEN prefix := 'CX2';
    ELSE prefix := 'CX3';
    END IF;

    -- Seed 20 contestants
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

    -- Seed 5 problems, each max 200 points
    FOR i IN 1..5 LOOP
      INSERT INTO problems (contest_id, title, max_points, sort_order)
      VALUES (c.id, 'P' || i, 200, i - 1)
      RETURNING id INTO prob_id;

      INSERT INTO subtasks (problem_id, label, points, test_count, sort_order)
      VALUES
        (prob_id, 'S1', 100, 10, 0),
        (prob_id, 'S2', 100, 10, 1);
    END LOOP;

    -- Create submissions + subtask scores
    FOR p IN SELECT id, sort_order FROM problems WHERE contest_id = c.id ORDER BY sort_order LOOP
      SELECT id INTO st1_id FROM subtasks WHERE problem_id = p.id AND sort_order = 0;
      SELECT id INTO st2_id FROM subtasks WHERE problem_id = p.id AND sort_order = 1;

      FOR i IN 1..20 LOOP
        base1 := 100 - ((i - 1) * 2 + (p.sort_order) * 3);
        base2 := 100 - ((i - 1) * 3 + (p.sort_order) * 2);
        points1 := GREATEST(0, LEAST(100, base1));
        points2 := GREATEST(0, LEAST(100, base2));

        INSERT INTO submissions (contestant_id, problem_id, submitted_at, total_points)
        VALUES (
          (SELECT id FROM contestants WHERE contest_id = c.id ORDER BY id LIMIT 1 OFFSET i - 1),
          p.id,
          NOW(),
          points1 + points2
        )
        RETURNING id INTO submission_id;

        INSERT INTO subtask_scores (submission_id, subtask_id, passed, points_awarded)
        VALUES
          (submission_id, st1_id, points1 > 0, points1),
          (submission_id, st2_id, points2 > 0, points2);
      END LOOP;
    END LOOP;

    -- Build leaderboard cache from best subtask scores
    WITH best_scores AS (
      SELECT s.contestant_id, s.problem_id,
        SUM(best_sub.best_points) as total
      FROM (
        SELECT DISTINCT contestant_id, problem_id FROM submissions
      ) s
      CROSS JOIN LATERAL (
        SELECT ss.subtask_id, MAX(ss.points_awarded) as best_points
        FROM subtask_scores ss
        JOIN submissions sub ON sub.id = ss.submission_id
        WHERE sub.contestant_id = s.contestant_id AND sub.problem_id = s.problem_id
        GROUP BY ss.subtask_id
      ) best_sub
      GROUP BY s.contestant_id, s.problem_id
    ),
    totals AS (
      SELECT contestant_id, COALESCE(SUM(total), 0) AS total_points
      FROM best_scores
      GROUP BY contestant_id
    ),
    ranked AS (
      SELECT cst.id AS contestant_id,
        COALESCE(t.total_points, 0) AS total_points,
        ROW_NUMBER() OVER (ORDER BY COALESCE(t.total_points, 0) DESC, cst.id ASC) AS rownum
      FROM contestants cst
      LEFT JOIN totals t ON t.contestant_id = cst.id
      WHERE cst.contest_id = c.id
    )
    INSERT INTO leaderboard_cache (contest_id, contestant_id, total_points, penalty_minutes, rank, updated_at)
    SELECT c.id, r.contestant_id, r.total_points, 60 + r.rownum * 3, 0, NOW()
    FROM ranked r;

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
