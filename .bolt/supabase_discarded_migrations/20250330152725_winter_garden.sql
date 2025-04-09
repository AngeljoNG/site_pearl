/*
  # Fix RLS policies for blog posts
  
  1. Changes
    - Drop existing RLS policies
    - Create new policies allowing public access
    - Ensure storage policies are correctly set
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all write operations" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow public access to blog-images" ON storage.objects;

-- Create new policies for blog_posts
CREATE POLICY "Allow public read access"
  ON public.blog_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON public.blog_posts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete"
  ON public.blog_posts
  FOR DELETE
  USING (true);

-- Create storage policies
CREATE POLICY "Allow public storage access"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

-- Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;