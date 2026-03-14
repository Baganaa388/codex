-- Drop subtask-related tables and reset all data
DROP TABLE IF EXISTS subtask_scores CASCADE;
DROP TABLE IF EXISTS subtasks CASCADE;

-- Truncate all data tables (keep schema)
TRUNCATE TABLE leaderboard_cache CASCADE;
TRUNCATE TABLE submissions CASCADE;
TRUNCATE TABLE contestants CASCADE;
TRUNCATE TABLE problems CASCADE;
TRUNCATE TABLE contests CASCADE;
TRUNCATE TABLE admins CASCADE;
