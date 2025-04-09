/*
  # Create storage for blog images
  
  1. Create Storage
    - Create a new public bucket for blog images
    - Set up appropriate policies for public access
*/

-- Enable storage by creating the storage schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS storage;

-- Create the blog-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to the blog-images bucket
CREATE POLICY "Allow public access to blog-images"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'blog-images');