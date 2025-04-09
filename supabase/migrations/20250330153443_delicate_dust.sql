/*
  # Fix storage configuration and RLS policies
  
  1. Changes
    - Create storage bucket if not exists
    - Update RLS policies for blog_posts
    - Add storage policies
*/

-- Create blog-images bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Update blog_posts RLS policies
DROP POLICY IF EXISTS "Allow public read access" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public insert" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public update" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public delete" ON public.blog_posts;

CREATE POLICY "Allow public read access"
  ON public.blog_posts
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Allow public write access"
  ON public.blog_posts
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON public.blog_posts
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON public.blog_posts
  FOR DELETE
  TO PUBLIC
  USING (true);

-- Add storage policies
DROP POLICY IF EXISTS "Allow public storage access" ON storage.objects;

CREATE POLICY "Allow public storage access"
  ON storage.objects
  FOR ALL
  TO PUBLIC
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');