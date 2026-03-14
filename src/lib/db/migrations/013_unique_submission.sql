-- One score per contestant per problem (simple edit, not best-of-many)
DELETE FROM submissions a USING submissions b
  WHERE a.id < b.id
    AND a.contestant_id = b.contestant_id
    AND a.problem_id = b.problem_id;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'unique_contestant_problem'
  ) THEN
    ALTER TABLE submissions
      ADD CONSTRAINT unique_contestant_problem UNIQUE (contestant_id, problem_id);
  END IF;
END
$$;
