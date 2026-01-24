-- Initial Schema: Base tables for Atomium game
-- Creates all foundational tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create molecules table
CREATE TABLE molecules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  formula TEXT NOT NULL,
  description TEXT NOT NULL,
  composition JSONB NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  structure JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(6) NOT NULL UNIQUE,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  host_id UUID,
  is_started BOOLEAN NOT NULL DEFAULT FALSE,
  is_finished BOOLEAN NOT NULL DEFAULT FALSE,
  winner_id UUID,
  molecule_id UUID REFERENCES molecules(id),
  current_question_id UUID,
  current_question_started_at TIMESTAMP WITH TIME ZONE,
  question_number INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'ready')),
  is_host BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('multiple_choice', 'true_false')),
  answer TEXT NOT NULL,
  options JSONB,
  difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  element VARCHAR(3) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, game_id, element)
);

-- Add foreign key constraint for games.current_question_id (must be after questions table)
ALTER TABLE games 
  ADD CONSTRAINT games_current_question_id_fkey 
  FOREIGN KEY (current_question_id) REFERENCES questions(id);

-- Add foreign key constraint for games.winner_id (must be after teams table)
ALTER TABLE games 
  ADD CONSTRAINT games_winner_id_fkey 
  FOREIGN KEY (winner_id) REFERENCES teams(id);

-- Create indexes
CREATE INDEX idx_games_code ON games(code);
CREATE INDEX idx_games_is_finished ON games(is_finished);
CREATE INDEX idx_games_winner_id ON games(winner_id);
CREATE INDEX idx_teams_game_id ON teams(game_id);
CREATE INDEX idx_answers_game_question ON answers(game_id, question_id);
CREATE INDEX idx_answers_team ON answers(team_id);
CREATE INDEX idx_inventory_team_game ON inventory(team_id, game_id);

-- Enable Row Level Security (RLS)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE molecules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for games
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create a game" ON games
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Host can update their game" ON games
  FOR UPDATE USING (true);

-- RLS Policies for teams
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create a team" ON teams
  FOR INSERT WITH CHECK (true);

-- RLS Policies for questions
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);

-- RLS Policies for answers
CREATE POLICY "Team answers are viewable by game participants" ON answers
  FOR SELECT USING (true);

CREATE POLICY "Teams can insert their own answers" ON answers
  FOR INSERT WITH CHECK (true);

-- RLS Policies for inventory
CREATE POLICY "Team inventory is viewable by game participants" ON inventory
  FOR SELECT USING (true);

CREATE POLICY "Team inventory can be updated" ON inventory
  FOR ALL USING (true);

-- RLS Policies for molecules
CREATE POLICY "Molecules are viewable by everyone" ON molecules
  FOR SELECT USING (true);

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE answers;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
