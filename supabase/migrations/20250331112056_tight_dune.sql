/*
  # Create contact requests table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `request_type` (text)
      - `message` (text)
      - `created_at` (timestamp with time zone)
      - `status` (text)

  2. Security
    - Enable RLS on `contact_requests` table
    - Add policy for public to insert
    - Add policy for authenticated users to read
*/

-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  request_type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public to insert contact requests"
  ON contact_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read contact requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (true);