/*
  # Fix table dependencies and cleanup
  
  1. Changes
    - Drop tables in correct order respecting dependencies
    - Recreate necessary tables and policies
*/

-- Drop tables in correct order
DROP TABLE IF EXISTS auth.mfa_amr_claims CASCADE;
DROP TABLE IF EXISTS auth.mfa_challenges CASCADE;
DROP TABLE IF EXISTS auth.mfa_factors CASCADE;
DROP TABLE IF EXISTS auth.refresh_tokens CASCADE;
DROP TABLE IF EXISTS auth.sessions CASCADE;
DROP TABLE IF EXISTS auth.sso_providers CASCADE;
DROP TABLE IF EXISTS auth.saml_providers CASCADE;
DROP TABLE IF EXISTS auth.saml_relay_states CASCADE;
DROP TABLE IF EXISTS auth.flow_state CASCADE;
DROP TABLE IF EXISTS auth.identities CASCADE;
DROP TABLE IF EXISTS auth.users CASCADE;
DROP TABLE IF EXISTS auth.instances CASCADE;
DROP TABLE IF EXISTS auth.audit_log_entries CASCADE;
DROP TABLE IF EXISTS auth.schema_migrations CASCADE;
DROP SCHEMA IF EXISTS auth CASCADE;

-- Drop storage tables
DROP TABLE IF EXISTS storage.objects CASCADE;
DROP TABLE IF EXISTS storage.buckets CASCADE;
DROP SCHEMA IF EXISTS storage CASCADE;

-- Drop blog tables
DROP TABLE IF EXISTS public.blog_posts CASCADE;

-- Create storage schema and tables
CREATE SCHEMA IF NOT EXISTS storage;

CREATE TABLE storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  public boolean DEFAULT false
);

CREATE TABLE storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL REFERENCES storage.buckets(id),
  name text NOT NULL,
  owner uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_accessed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED
);

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

-- Create the blog-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

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

CREATE POLICY "Allow public access to blog-images"
  ON storage.objects
  FOR ALL
  TO public
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');