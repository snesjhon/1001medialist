# 🎬🎵 1001 Movies & Albums

A web service for discovering and tracking your journey through 1001 essential movies and albums, inspired by [1001albumsgenerator.com](https://1001albumsgenerator.com/albums).

## Overview

Sign up with your Google account and get presented with sequential pairs of albums and movies to experience. Track your progress, rate what you've seen and heard, and explore fun stats about your cultural journey.

---

## Tech Stack

**Frontend:**
- Next.js 14+ (App Router) with TypeScript
- shadcn/ui components + Tailwind CSS
- Deployment: Vercel (free tier)

**Backend:**
- Supabase (PostgreSQL database, auth, storage)
- Free tier: 500MB database, 50K MAU

**External APIs:**
- TMDB API (movies metadata, posters, trailers)
- Spotify API or Last.fm (albums metadata, artwork, previews)

---

## Database Schema (Supabase PostgreSQL)

```sql
-- Core data tables
albums (
  id, title, artist, year, genre, cover_url,
  spotify_id, list_number (1-1001)
)

movies (
  id, title, director, year, genre, poster_url,
  tmdb_id, runtime, list_number (1-1001)
)

-- User data tables
profiles (
  id, user_id (ref auth.users), created_at,
  current_pair_number, display_name
)

user_albums (
  user_id, album_id, completed_at, rating (1-5),
  skipped, notes
)

user_movies (
  user_id, movie_id, completed_at, rating (1-5),
  skipped, notes
)
```

---

## MVP Features & User Flow

### 1. Authentication
- Google OAuth via Supabase Auth
- Auto-create user profile on first login
- Simple landing page with "Sign in with Google" button

### 2. Main Dashboard
- Show current pair (album + movie)
- Display album artwork and movie poster side-by-side
- Quick actions: Play preview (Spotify), Watch trailer (YouTube/TMDB)
- Buttons: "Mark as Complete", "Skip", "Rate & Complete"

### 3. Completion Flow
- Modal/drawer for rating (1-5 stars) and optional notes
- Mark as complete → increment pair number → show next pair
- Skip → mark as skipped → show next pair
- Celebration animation on completion

### 4. Stats Dashboard
- **Progress**: X/1001 albums, Y/1001 movies, completion %
- **Genre Breakdown**: Pie/bar charts for genres consumed
- **Personal Insights**: Average ratings, top-rated items, completion timeline
- **Visual Progress**: Progress bars, milestone badges (25, 100, 500, 1001)

### 5. Profile/History Page
- List of completed albums/movies
- Filter by: completed/skipped, ratings, genre
- Search functionality

---

## Implementation Phases

### Phase 1: Foundation
1. Set up Next.js project with TypeScript, Tailwind, shadcn/ui
2. Configure Supabase project (database, auth)
3. Implement Google OAuth
4. Design database schema and create tables
5. Build basic layout (navbar, landing page)

### Phase 2: Data Sourcing
1. Research and compile 1001 albums list (likely from "1001 Albums You Must Hear Before You Die" book)
2. Research and compile 1001 movies list (from "1001 Movies You Must See Before You Die" book)
3. Write scripts to fetch metadata from TMDB and Spotify APIs
4. Populate Supabase database with enriched data
5. Handle missing data gracefully

### Phase 3: Core Features
1. Build current pair display component
2. Implement completion/rating modal
3. Connect to Supabase (read current pair, update progress)
4. Add skip functionality
5. Implement next pair logic (sequential by list_number)
6. Add Spotify preview player and TMDB trailer links

### Phase 4: Stats Dashboard
1. Create stats page layout
2. Build progress tracking components
3. Implement genre breakdown charts (use Recharts or Chart.js)
4. Add personal insights (average ratings, favorites)
5. Create celebration animations and milestone badges

### Phase 5: Polish & Deploy
1. Vibrant & playful UI polish (animations, colors, micro-interactions)
2. Mobile responsive design
3. Add loading states and error handling
4. SEO optimization (meta tags, OG images)
5. Deploy to Vercel
6. Test with real users

---

## Key Technical Decisions

**Why Supabase?**
- Great for learning SQL (direct PostgreSQL access)
- Built-in auth (no need for separate service)
- Real-time subscriptions (future feature: live stats)
- Row Level Security for data protection
- Free tier is very generous

**Why Next.js on Vercel?**
- Server components reduce client bundle size
- API routes for backend logic if needed
- Zero-config deployment
- Free tier: unlimited personal projects
- Automatic HTTPS, CDN, preview deployments

**Why shadcn/ui?**
- Copy-paste components (no package bloat)
- Built on Radix UI (accessible by default)
- Full Tailwind customization
- Beautiful defaults, easy to make vibrant/playful

---

## Cost Estimate

- **Supabase**: Free tier (stays free unless you exceed 500MB DB)
- **Vercel**: Free tier (personal use)
- **TMDB API**: Free (with attribution)
- **Spotify API**: Free (with Spotify account)

**Total monthly cost: $0** ✨

---

## Potential Challenges & Solutions

**Challenge 1: Data sourcing**
- Solution: Scrape from Wikipedia, cross-reference with TMDB/Spotify, manual cleanup

**Challenge 2: Spotify API rate limits**
- Solution: Cache data in Supabase, pre-fetch all metadata during setup

**Challenge 3: Users want to jump to specific pair**
- Solution: Add "Go to pair #" feature in later version (post-MVP)

**Challenge 4: Mobile UX for side-by-side display**
- Solution: Stack vertically on mobile, horizontal on tablet+

---

## Future Enhancements (Post-MVP)

- Social features (share progress, compare with friends)
- Watchlist/listening queue
- Daily recommendation (optional daily pair for all users)
- Themed challenges (80s month, sci-fi sprint)
- Integration with Letterboxd, Rate Your Music
- Export data as JSON/CSV
- Dark mode toggle

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/snesjhon/1001medialist.git
cd 1001medialist

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase and API keys

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

---

## License

MIT
