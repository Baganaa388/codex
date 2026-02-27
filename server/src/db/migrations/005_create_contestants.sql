CREATE TABLE IF NOT EXISTS contestants (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  reg_number VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('Бага', 'Дунд', 'Ахлах')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contestants_contest_id ON contestants(contest_id);
CREATE INDEX IF NOT EXISTS idx_contestants_reg_number ON contestants(reg_number);
CREATE INDEX IF NOT EXISTS idx_contestants_category ON contestants(category);
