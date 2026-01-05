-- Add watch_provider_link field to movies table
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS watch_provider_link text;
