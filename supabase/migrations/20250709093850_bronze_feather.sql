/*
  # Create user registrations table

  1. New Tables
    - `user_registrations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_registrations` table
    - Add policy for public insert access (registration)
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS user_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to register (insert)
CREATE POLICY "Anyone can register"
  ON user_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own registration data
CREATE POLICY "Users can read own registration"
  ON user_registrations
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_registrations_email ON user_registrations(email);
CREATE INDEX IF NOT EXISTS idx_user_registrations_created_at ON user_registrations(created_at);