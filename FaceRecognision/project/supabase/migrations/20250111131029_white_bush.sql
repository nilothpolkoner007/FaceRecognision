/*
  # Create profiles and mood history tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
    - `mood_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `mood` (text)
      - `mood_color` (text)
      - `song_suggestion` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  created_at timestamptz DEFAULT now()
);

-- Create mood history table
CREATE TABLE IF NOT EXISTS mood_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  mood text NOT NULL,
  mood_color text NOT NULL,
  song_suggestion text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own mood history"
  ON mood_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood history"
  ON mood_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);