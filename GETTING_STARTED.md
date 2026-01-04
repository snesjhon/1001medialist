# Getting Started

Welcome to 1001 Movies & Albums! This guide will help you get the application running.

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Get these from https://supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional for data seeding
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### 3. Set Up Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the SQL from `supabase/migrations/00001_initial_schema.sql`
4. Run the SQL to create all tables and policies

### 4. Configure Google OAuth

1. Go to Authentication > Providers in Supabase dashboard
2. Enable Google provider
3. Follow Supabase instructions to set up Google OAuth credentials
4. Add redirect URL: `http://localhost:3000/auth/callback` (for local development)

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

You should now be able to:

- See the landing page
- Sign in with Google
- Have a profile created automatically

## Populating Data (Required for Full Functionality)

The app needs 1001 movies and 1001 albums in the database to work properly.

### Step 1: Add Movie & Album Lists

Edit these files with your data:

- `scripts/seed-data/movies-list.ts` - Add 1001 movies
- `scripts/seed-data/albums-list.ts` - Add 1001 albums

Sample data is provided. Replace with actual data from:

- "1001 Movies You Must See Before You Die" book
- "1001 Albums You Must Hear Before You Die" book
- Community-maintained lists online

### Step 2: Fetch Metadata (Optional but Recommended)

Get API keys:

- TMDB: https://www.themoviedb.org/settings/api
- Spotify: https://developer.spotify.com/dashboard

Add them to `.env.local`, then run:

```bash
# Fetch movie posters, genres, runtime, etc.
npx tsx scripts/fetch-tmdb-metadata.ts

# Fetch album covers, genres, etc.
npx tsx scripts/fetch-spotify-metadata.ts
```

This will create enriched JSON files in `scripts/seed-data/`.

### Step 3: Seed Database

```bash
# Add SUPABASE_SERVICE_KEY to .env.local (from Supabase Settings > API)
npx tsx scripts/seed-database.ts
```

This uploads all data to your Supabase database.

## Verification Checklist

After setup, verify everything works:

- [ ] Can sign in with Google
- [ ] Profile is created automatically
- [ ] Dashboard shows a pair (album + movie)
- [ ] Can rate items (1-5 stars)
- [ ] Can skip items
- [ ] Pair advances after both items completed/skipped
- [ ] Stats page shows progress
- [ ] History page shows completed items
- [ ] Search and filters work

## Common Issues

### "Unable to load your data"

- Check that the database migration ran successfully
- Ensure you have at least one album and movie in the database
- Check Supabase connection in browser console

### Authentication errors

- Verify redirect URLs match in Google OAuth and Supabase
- Check that Google provider is enabled in Supabase
- Ensure `NEXT_PUBLIC_SITE_URL` is correct

### Database errors

- Run the migration SQL again if tables are missing
- Check that RLS policies are enabled
- Verify service role key for seeding scripts

## File Structure

```
1001medialist/
├── src/                  # Application source
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities and clients
│   └── types/           # TypeScript types
├── scripts/             # Data seeding scripts
├── supabase/            # Database migrations
├── public/              # Static assets
└── docs/                # Additional documentation
```

## Next Steps

1. **Populate Data:** Add all 1001 items (see above)
2. **Customize:** Adjust colors, branding, copy
3. **Test:** Try all features thoroughly
4. **Deploy:** Follow DEPLOYMENT.md when ready

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Lint code
```

## Getting Help

- Check PROJECT_SUMMARY.md for architecture overview
- See SUPABASE_SETUP.md for database details
- Review DEPLOYMENT.md for production deployment
- Read scripts/README.md for data seeding help

## Features Overview

**Dashboard**

- View current album and movie pair
- Rate with 1-5 stars
- Add optional notes
- Skip items you don't want to experience
- Links to Spotify and TMDB

**Stats**

- Total completion metrics
- Genre breakdown charts
- Milestone achievements
- Top-rated items

**History**

- All completed and skipped items
- Search by title, artist, director
- Filter by status
- Tabbed view (All/Albums/Movies)

Enjoy your cultural journey! 🎬🎵
