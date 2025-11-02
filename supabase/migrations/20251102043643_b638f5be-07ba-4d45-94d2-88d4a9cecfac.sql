-- Create storage bucket for prompt images
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow anyone to view images
CREATE POLICY "Anyone can view prompt images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'prompt-images');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload prompt images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'prompt-images' 
  AND auth.role() = 'authenticated'
);

-- Add example_images column to prompts table to store multiple image URLs
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS example_images text[] DEFAULT '{}';

-- Add user_id column to track who created the prompt
ALTER TABLE prompts
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policy for inserting prompts to check authentication
DROP POLICY IF EXISTS "Authenticated users can insert prompts" ON prompts;
CREATE POLICY "Authenticated users can insert prompts"
ON prompts
FOR INSERT
WITH CHECK (auth.uid() = user_id);