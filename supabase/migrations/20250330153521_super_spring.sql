/*
  # Fix storage policies and bucket creation
  
  1. Changes
    - Create storage bucket with proper permissions
    - Set up storage RLS policies correctly
    - Ensure public access to blog-images bucket
*/

-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure storage schema exists
CREATE SCHEMA IF NOT EXISTS storage;

-- Create storage.buckets table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.buckets (
    id text PRIMARY KEY,
    name text NOT NULL,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[]
);

-- Create storage.objects table if it doesn't exist
CREATE TABLE IF NOT EXISTS storage.objects (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    last_accessed_at timestamptz DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
    CONSTRAINT objects_buckets_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets (id)
);

-- Create blog-images bucket
INSERT INTO storage.buckets (id, name, public, owner)
VALUES ('blog-images', 'blog-images', true, auth.uid())
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policies for buckets
DROP POLICY IF EXISTS "Give users access to own bucket" ON storage.buckets;
CREATE POLICY "Give users access to own bucket"
ON storage.buckets
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create policies for objects
DROP POLICY IF EXISTS "Give users access to own objects" ON storage.objects;
CREATE POLICY "Give users access to own objects"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');