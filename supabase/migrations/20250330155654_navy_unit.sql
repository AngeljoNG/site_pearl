/*
  # Add image dimensions to blog_posts table

  1. Changes
    - Add columns for storing image dimensions
    - Update existing rows with default values
*/

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS image_width integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_height integer DEFAULT 0;