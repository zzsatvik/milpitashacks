-- Run this in your InsForge dashboard (SQL editor / Database section)
-- Creates the table for saving Terraview audit results per user

CREATE TABLE IF NOT EXISTS lawn_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  summary TEXT NOT NULL,
  overall_grade TEXT NOT NULL,
  analysis JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lawn_audits_user_id_idx ON lawn_audits (user_id);
CREATE INDEX IF NOT EXISTS lawn_audits_created_at_idx ON lawn_audits (created_at DESC);

-- Row-level security: users can only access their own audits
ALTER TABLE lawn_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own audits"
  ON lawn_audits FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own audits"
  ON lawn_audits FOR INSERT
  WITH CHECK (user_id = auth.uid());
