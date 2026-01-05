# 🎬🎵 1001 Movies & Albums

A web service for discovering and tracking your journey through 1001 essential movies and albums, inspired by [1001albumsgenerator.com](https://1001albumsgenerator.com/albums).

## Project Status

**Current Version:** Alpha Development
**Database:** 10/1001 movies, 10/1001 albums seeded
**Last Updated:** January 2026

---

## Tech Stack

**Frontend:**
- Next.js 15 (App Router) with TypeScript
- shadcn/ui components (New York style) + Tailwind CSS
- React 18

**Backend:**
- Supabase (PostgreSQL database + auth)
- Server Actions for data mutations
- Row Level Security (RLS) policies

**External APIs:**
- TMDB API (movies metadata, posters, watch providers)
- iTunes Search API (albums metadata, artwork)

**Development Tools:**
- tsx for running TypeScript scripts
- dotenv for environment management

---

## Database Schema

```sql
-- Core media tables
albums (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT,
  cover_url TEXT,
  spotify_id TEXT,
  description TEXT,
  list_number INTEGER UNIQUE (1-1001),
  created_at TIMESTAMP
)

movies (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  director TEXT NOT NULL,
  year INTEGER NOT NULL,
  genre TEXT,
  poster_url TEXT,
  tmdb_id INTEGER,
  runtime INTEGER,
  description TEXT,
  watch_provider_link TEXT,  -- NEW: Direct link to TMDB watch providers
  list_number INTEGER UNIQUE (1-1001),
  created_at TIMESTAMP
)

-- User management
profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  current_pair_number INTEGER DEFAULT 1,
  display_name TEXT,
  created_at TIMESTAMP
)

-- User progress tracking
user_albums (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  album_id UUID REFERENCES albums,
  completed_at TIMESTAMP,
  rating INTEGER CHECK (1-5),
  skipped BOOLEAN DEFAULT false,
  notes TEXT,
  UNIQUE(user_id, album_id)
)

user_movies (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  movie_id UUID REFERENCES movies,
  completed_at TIMESTAMP,
  rating INTEGER CHECK (1-5),
  skipped BOOLEAN DEFAULT false,
  notes TEXT,
  UNIQUE(user_id, movie_id)
)
```

---

## Implemented Features

### ✅ Authentication
- Google OAuth via Supabase Auth
- Auto-create user profile on first login
- Landing page with "Sign in with Google" button
- Middleware-based route protection

### ✅ Dashboard (`/dashboard`)
- Shows your **current pair** based on progress
- Horizontal layout: Album (left) | Movie (right)
- Full cover art display (not cropped, using `object-contain`)
- Album and movie cards with:
  - Cover art/poster (320px height, equal for both)
  - Title, artist/director
  - Year, genre, runtime badges
  - Description
  - External links (Spotify/TMDB)
  - Complete/Skip buttons
- Progress bar at bottom (full width)
- Automatic pair advancement when both items completed

### ✅ Specific Pair View (`/media/[number]`)
- View any pair by number (1-1001)
- Same layout as dashboard
- Can rate/skip from any pair
- Shows completion status if already done
- Direct shareable URLs

### ✅ List View (`/list`)
- Paginated list of all pairs (25 per page)
- Each row shows:
  - Pair number
  - Album cover + info
  - Movie poster + info
  - Completion badges (rating or "skipped")
- Click any row to view that pair
- Pagination controls (prev/next + page numbers)

### ✅ Progress Tracking
- Current pair number
- Albums completed count
- Movies completed count
- Overall progress percentage
- Progress bar visualization

### ✅ Server Actions
- `getCurrentPair(userId)` - Get current pair based on progress
- `getPairByNumber(userId, pairNumber)` - Get specific pair
- `getPairsList(userId, page, pageSize)` - Get paginated pairs with completion status
- `completeAlbum/completeMovie(userId, itemId, rating, notes?)` - Mark complete with rating
- `skipAlbum/skipMovie(userId, itemId)` - Mark as skipped
- `getProgress(userId)` - Get user's progress stats
- Auto-advance logic when both items in pair completed

---

## Project Structure

```
1001medialist/
├── src/
│   ├── app/
│   │   ├── actions/          # Server actions
│   │   │   ├── auth.ts       # Authentication actions
│   │   │   └── pairs.ts      # Pair management actions
│   │   ├── dashboard/        # Dashboard route
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── list/             # List view route
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── media/[number]/   # Specific pair route
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   ├── history/          # History page (placeholder)
│   │   ├── stats/            # Stats page (placeholder)
│   │   ├── layout.tsx        # Root layout with navbar
│   │   └── page.tsx          # Landing page
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AlbumCard.tsx
│   │   │   ├── MovieCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── CompleteButton.tsx
│   │   │   └── SkipButton.tsx
│   │   ├── ui/               # shadcn/ui components
│   │   └── auth/
│   ├── lib/
│   │   └── supabase/         # Supabase client setup
│   └── types/
│       └── database.types.ts # TypeScript types for database
├── scripts/
│   ├── fetch-tmdb-data.ts         # Fetch movies from TMDB API
│   ├── convert-albums-data.ts     # Convert albums CSV to JSON with iTunes API
│   ├── seed-database.ts           # Seed Supabase with movies/albums
│   ├── clear-database.ts          # Clear all data
│   ├── verify-tmdb-data.ts        # Verify TMDB data
│   ├── verify-albums.ts           # Verify albums data
│   └── seed-data/
│       ├── movies-list.ts         # 10 movies with TMDB metadata
│       ├── movies-source.json     # Source movie data
│       └── albums-list.ts         # 10 albums with iTunes metadata
├── supabase/
│   └── migrations/
│       ├── 00001_initial_schema.sql
│       ├── 00002_add_descriptions.sql
│       └── 00003_add_watch_provider_link.sql
└── .env.local                     # Environment variables (not in repo)
```

---

## Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key  # For seeding

# TMDB API (use access token, not API key)
TMDB_API_KEY=your_tmdb_access_token  # Actually the Bearer token (JWT)

# Optional: If you want to use different variable name
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

---

## Data Status

### Movies (10/1001)
- **Source:** "1001 Movies You Must See Before You Die"
- **Data Provider:** TMDB API
- **Includes:**
  - TMDB ID
  - Title, director, year
  - Genre, runtime
  - High-res poster URLs (600x900)
  - Plot descriptions
  - **Watch provider links** (where to stream/rent/buy)
- **Watch Provider Coverage:** 9/10 movies (90%)

### Albums (10/1001)
- **Source:** "1001 Albums You Must Hear Before You Die"
- **Data Provider:** iTunes Search API
- **Includes:**
  - Title, artist, year
  - Genre
  - High-res cover art (600x600)
- **Note:** No descriptions (source data doesn't include them)

---

## Available Scripts

### Data Fetching

```bash
# Fetch TMDB data for movies (with watch providers)
npx tsx scripts/fetch-tmdb-data.ts [start] [end]
# Example: npx tsx scripts/fetch-tmdb-data.ts 0 10

# Convert albums from CSV and fetch iTunes metadata
npx tsx scripts/convert-albums-data.ts [start] [end]
# Example: npx tsx scripts/convert-albums-data.ts 0 10
```

### Database Management

```bash
# Clear all movies and albums from database
npx tsx scripts/clear-database.ts

# Seed database with current data
npx tsx scripts/seed-database.ts

# Verify TMDB data
npx tsx scripts/verify-tmdb-data.ts

# Verify albums data
npx tsx scripts/verify-albums.ts
```

### Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/snesjhon/1001medialist.git
cd 1001medialist
npm install
```

### 2. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and keys
3. Run migrations in Supabase SQL Editor:
   - `supabase/migrations/00001_initial_schema.sql`
   - `supabase/migrations/00002_add_descriptions.sql`
   - `supabase/migrations/00003_add_watch_provider_link.sql`

### 3. Get API Keys

**TMDB API:**
1. Go to https://www.themoviedb.org/settings/api
2. Get your "API Read Access Token" (Bearer token/JWT)
3. Add to `.env.local` as `TMDB_API_KEY`

### 4. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

### 5. Seed Database

```bash
# First 10 movies are already in scripts/seed-data/movies-list.ts
# First 10 albums are already in scripts/seed-data/albums-list.ts
npx tsx scripts/seed-database.ts
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Key Implementation Details

### URL Structure
- **`/dashboard`** - Shows YOUR current pair (based on progress)
- **`/media/1`** through **`/media/1001`** - View any specific pair
- **`/list`** - Browse all pairs with pagination
- **`/history`** - Your completed pairs (TODO)
- **`/stats`** - Your statistics (TODO)

### Layout Design
- **Dashboard/Media Pages:**
  - Centered content (max-w-7xl)
  - Album and movie cards side-by-side (2-column grid)
  - Both cards have equal heights (h-full flex flex-col)
  - Cover art: 320px fixed height, object-contain (full image visible)
  - Progress bar: full width at bottom

- **List Page:**
  - Each row: Pair # | Album (cover + info) | Movie (poster + info)
  - Cover art: 96×96px, object-contain
  - Rows have fixed heights with items-center alignment
  - Pagination: 25 pairs per page

### Server Actions Pattern
- All data mutations use Server Actions (no API routes)
- Automatic revalidation with `revalidatePath()`
- Type-safe with Supabase TypeScript types
- RLS policies enforce user data isolation

### TMDB Watch Providers
- Links point to TMDB's watch provider page
- Shows streaming, rental, and purchase options
- US region only currently
- Format: `https://www.themoviedb.org/movie/{tmdb_id}/watch?locale=US`

---

## Next Steps / TODO

### High Priority
- [ ] Fetch remaining movies (11-1001) from TMDB
- [ ] Fetch remaining albums (11-1001) from iTunes
- [ ] Implement History page (/history)
- [ ] Implement Stats page with charts
- [ ] Add mobile responsiveness testing

### Medium Priority
- [ ] Add TMDB trailer integration
- [ ] Add genre breakdown charts (Recharts)
- [ ] Add milestone badges (25, 100, 500, 1001)
- [ ] Add search/filter to history page
- [ ] Add "random pair" functionality
- [ ] Improve error handling and loading states

### Low Priority
- [ ] Add Spotify preview player for albums
- [ ] Export data as JSON/CSV
- [ ] Social features (share progress)
- [ ] Dark mode
- [ ] PWA support

---

## Known Issues / Notes

1. **TMDB API Key:** The variable is named `TMDB_API_KEY` but expects the Bearer token (JWT), not the v3 API key
2. **Album Descriptions:** Not available from iTunes API, source data doesn't include them
3. **Watch Providers:** ~10% of movies may not have watch provider links
4. **Data Source:** Using CSV file from GitHub for albums list
5. **Rate Limiting:** TMDB script includes 250ms delay between requests
6. **Year Discrepancy:** "Le Voyage Dans La Lune" shows as 2011 in first data but is actually 1902 (fixed in current version)

---

## Cost Estimate

- **Supabase:** Free tier (500MB database, 50K MAU)
- **Vercel:** Free tier (deployment not yet set up)
- **TMDB API:** Free (with attribution)
- **iTunes Search API:** Free (no auth required)

**Total monthly cost: $0** ✨

---

## License

MIT

---

## Developer Notes

### When Resuming Development

1. Check current data status: `npx tsx scripts/verify-tmdb-data.ts`
2. Review TODO list above
3. If adding more movies: Update `scripts/seed-data/movies-source.json` then run fetch script
4. If adding more albums: Get CSV data, run `scripts/convert-albums-data.ts`
5. Always test with `/list` page to verify data display

### Important Files to Check
- `src/types/database.types.ts` - Database schema types
- `src/app/actions/pairs.ts` - All data fetching logic
- `scripts/seed-data/` - Current seeded data
- `.env.local` - API credentials (not in repo)

### Common Commands
```bash
# Quick verification of setup
npx tsx scripts/verify-tmdb-data.ts
npx tsx scripts/verify-albums.ts

# Re-seed from scratch
npx tsx scripts/clear-database.ts
npx tsx scripts/seed-database.ts

# Fetch next batch of movies (example: 10-20)
npx tsx scripts/fetch-tmdb-data.ts 10 20
npx tsx scripts/seed-database.ts
```
