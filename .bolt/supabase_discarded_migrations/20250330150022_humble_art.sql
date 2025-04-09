-- Drop all existing tables
DROP TABLE IF EXISTS auth.identities CASCADE;
DROP TABLE IF EXISTS auth.sessions CASCADE;
DROP TABLE IF EXISTS auth.mfa_factors CASCADE;
DROP TABLE IF EXISTS auth.one_time_tokens CASCADE;
DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;
DROP TABLE IF EXISTS auth.users CASCADE;
DROP TABLE IF EXISTS auth.audit_log_entries CASCADE;
DROP TABLE IF EXISTS auth.instances CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;

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

-- Create policies for unrestricted access
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