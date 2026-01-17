-- Add meta column to game_scores if it doesn't exist
ALTER TABLE public.game_scores 
ADD COLUMN IF NOT EXISTS meta JSONB DEFAULT '{}'::jsonb;

-- Create index on meta for potential advanced queries (optional)
CREATE INDEX IF NOT EXISTS game_scores_meta_idx ON public.game_scores USING gin (meta);
