CREATE TABLE IF NOT EXISTS subtasks (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  test_count INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subtasks_problem_id ON subtasks(problem_id);
