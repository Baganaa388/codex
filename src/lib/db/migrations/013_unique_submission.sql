-- One score per contestant per problem (simple edit, not best-of-many)
DELETE FROM submissions a USING submissions b
  WHERE a.id < b.id
    AND a.contestant_id = b.contestant_id
    AND a.problem_id = b.problem_id;

ALTER TABLE submissions
  ADD CONSTRAINT unique_contestant_problem UNIQUE (contestant_id, problem_id);
