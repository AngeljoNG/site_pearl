/*
  # Create simple blog structure
  
  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `excerpt` (text)
      - `cover_image` (text)
      - `reading_time` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on blog_posts table
    - Add policy for public read access
    - Add policy for all write operations (temporarily unrestricted)
*/

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS public.blog_posts;

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  cover_image text NOT NULL,
  reading_time integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for unrestricted access (temporary)
CREATE POLICY "Allow public read access"
  ON blog_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all write operations"
  ON blog_posts
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);