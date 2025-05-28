-- Create watchlist table
CREATE TABLE IF NOT EXISTS watchlist (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);

-- Create history table
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, movie_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);

-- Add Row Level Security (RLS) policies to restrict access
-- Users can only see and manipulate their own data

-- Enable RLS on watchlist
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;

-- Policy for watchlist
CREATE POLICY watchlist_user_policy ON watchlist 
  USING (user_id = auth.jwt()->> 'sub')
  WITH CHECK (user_id = auth.jwt()->> 'sub');

-- Enable RLS on history
ALTER TABLE history ENABLE ROW LEVEL SECURITY;

-- Policy for history
CREATE POLICY history_user_policy ON history 
  USING (user_id = auth.jwt()->> 'sub')
  WITH CHECK (user_id = auth.jwt()->> 'sub');
