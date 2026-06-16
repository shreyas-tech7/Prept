-- Prept database schema
-- Run this in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

-- Sessions: one per interview practice run
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  job_description TEXT,
  interview_type TEXT NOT NULL CHECK (interview_type IN ('behavioral', 'technical', 'mixed')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('entry', 'mid', 'senior')),
  question_count INTEGER NOT NULL DEFAULT 5,
  total_score NUMERIC,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Responses: one per question answered
CREATE TABLE IF NOT EXISTS responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT,
  user_answer TEXT NOT NULL,
  score NUMERIC CHECK (score >= 1 AND score <= 10),
  strengths TEXT[],
  improvements TEXT[],
  model_answer TEXT,
  star_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_session ON responses(session_id, question_number);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users own sessions" ON sessions;
CREATE POLICY "Users own sessions"
  ON sessions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own responses" ON responses;
CREATE POLICY "Users own responses"
  ON responses FOR ALL USING (auth.uid() = user_id);
