-- Add description field to movies table
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS description text;

-- Add description field to albums table
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS description text;
