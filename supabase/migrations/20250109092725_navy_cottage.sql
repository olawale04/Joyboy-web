/*
  # Initial Schema Setup for Joy Tips

  1. Tables
    - rewards: Stores the reward content set by admin
    - challenge_users: Stores the challenge access password
    - participants: Tracks user progress through challenges
    - winners: Records the winner of the challenge

  2. Security
    - RLS enabled on all tables
    - Appropriate policies for admin and participant access
*/

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

-- Create challenge_users table
CREATE TABLE IF NOT EXISTS challenge_users (
  id INTEGER PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE challenge_users ENABLE ROW LEVEL SECURITY;

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  start_time TIMESTAMPTZ DEFAULT now(),
  current_page INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create winners table
CREATE TABLE IF NOT EXISTS winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  claim_time TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE winners ENABLE ROW LEVEL SECURITY;

-- Set up RLS policies
CREATE POLICY "Allow admin full access to rewards"
  ON rewards
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

CREATE POLICY "Allow public read access to challenge_users"
  ON challenge_users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin write access to challenge_users"
  ON challenge_users
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true))
  WITH CHECK (auth.uid() IN (SELECT id FROM auth.users WHERE is_admin = true));

CREATE POLICY "Allow participants to insert their own records"
  ON participants
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow participants to update their own records"
  ON participants
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to winners"
  ON winners
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow participants to insert winner record"
  ON winners
  FOR INSERT
  TO public
  WITH CHECK (true);