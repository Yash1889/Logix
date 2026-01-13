-- Create game_scores table
CREATE TABLE IF NOT EXISTS public.game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  score NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Secure the table
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- Policies

-- Users can insert their own scores
CREATE POLICY "Users can insert own scores" ON public.game_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own scores
CREATE POLICY "Users can view own scores" ON public.game_scores
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS game_scores_user_id_idx ON public.game_scores(user_id);
CREATE INDEX IF NOT EXISTS game_scores_game_id_idx ON public.game_scores(game_id);
CREATE INDEX IF NOT EXISTS game_scores_score_idx ON public.game_scores(score);
