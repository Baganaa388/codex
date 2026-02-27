CREATE TABLE IF NOT EXISTS subtask_scores (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  subtask_id INTEGER NOT NULL REFERENCES subtasks(id) ON DELETE CASCADE,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  points_awarded INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_subtask_scores_submission_id ON subtask_scores(submission_id);
