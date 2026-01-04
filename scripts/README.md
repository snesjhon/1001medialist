# Data Seeding Scripts

This directory contains scripts to populate your database with 1001 movies and albums.

## Setup

1. **Get API Keys:**
   - TMDB: https://www.themoviedb.org/settings/api
   - Spotify: https://developer.spotify.com/dashboard
   - Supabase: From your project settings

2. **Add to `.env.local`:**
   ```
   NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   SUPABASE_SERVICE_KEY=your_service_role_key
   ```

3. **Install tsx** (TypeScript executor):
   ```bash
   npm install -D tsx
   ```

## Step-by-Step Process

### Step 1: Populate the Lists

Edit the following files with actual data:
- `seed-data/movies-list.ts` - Add all 1001 movies
- `seed-data/albums-list.ts` - Add all 1001 albums

You can source this data from:
- "1001 Movies You Must See Before You Die" book
- "1001 Albums You Must Hear Before You Die" book
- Wikipedia lists
- Community-maintained lists

### Step 2: Fetch Metadata

Run these scripts to enrich the data with API metadata:

```bash
# Fetch movie data from TMDB (posters, genres, runtime, etc.)
npx tsx scripts/fetch-tmdb-metadata.ts

# Fetch album data from Spotify (covers, genres, etc.)
npx tsx scripts/fetch-spotify-metadata.ts
```

This will generate:
- `seed-data/movies-enriched.json`
- `seed-data/albums-enriched.json`

### Step 3: Seed Database

Upload the enriched data to Supabase:

```bash
npx tsx scripts/seed-database.ts
```

## Notes

- The scripts include rate limiting to respect API quotas
- Failed API calls will be logged but won't stop the process
- You can re-run the seed-database script to update existing data
- Make sure your Supabase database schema is set up first (run the migration SQL)

## Troubleshooting

- **TMDB API errors**: Check your API key and rate limits
- **Spotify auth errors**: Verify your client ID and secret
- **Supabase errors**: Ensure the service role key has proper permissions
- **Missing data**: Some movies/albums might not be found - check spelling and year
