-- Migration: Game Questions Feature
-- Creates tables for questions, team answers, and team inventory

-- 1. Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('multiple_choice', 'true_false')),
  answer TEXT NOT NULL,
  options JSONB, -- For multiple choice: ["H₂O", "OH⁻", "H₂O₂", "HO₂"]
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_answers_game_question ON answers(game_id, question_id);
CREATE INDEX idx_answers_team ON answers(team_id);

-- 3. Create inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  element VARCHAR(3) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, game_id, element)
);

-- Create index for faster lookups
CREATE INDEX idx_inventory_team_game ON inventory(team_id, game_id);

-- 4. Extend games table with question tracking fields
ALTER TABLE games 
  ADD COLUMN IF NOT EXISTS current_question_id UUID REFERENCES questions(id),
  ADD COLUMN IF NOT EXISTS current_question_started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS question_number INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 10;

-- 5. Enable Row Level Security (RLS) for new tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for questions (read-only for all authenticated users)
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);

-- 7. Create RLS policies for answers
CREATE POLICY "Team answers are viewable by game participants" ON answers
  FOR SELECT USING (true);

CREATE POLICY "Teams can insert their own answers" ON answers
  FOR INSERT WITH CHECK (true);

-- 8. Create RLS policies for inventory
CREATE POLICY "Team inventory is viewable by game participants" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Team inventory can be updated" ON inventory
  FOR ALL USING (true);

-- 9. Enable realtime for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
