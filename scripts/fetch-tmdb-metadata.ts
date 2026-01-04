/**
 * Script to fetch movie metadata from TMDB API
 *
 * Usage:
 * 1. Get a TMDB API key from https://www.themoviedb.org/settings/api
 * 2. Add it to your .env.local as NEXT_PUBLIC_TMDB_API_KEY
 * 3. Run: npx tsx scripts/fetch-tmdb-metadata.ts
 */

import { moviesList, type MovieSeed } from "./seed-data/movies-list";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  genre_ids: number[];
  runtime: number | null;
}

interface EnrichedMovie {
  title: string;
  director: string;
  year: number;
  list_number: number;
  tmdb_id: number | null;
  poster_url: string | null;
  genre: string | null;
  runtime: number | null;
  description?: string;
}

async function searchMovie(title: string, year: number): Promise<TMDBMovie | null> {
  if (!TMDB_API_KEY) {
    console.error("TMDB API key not found. Please set NEXT_PUBLIC_TMDB_API_KEY in .env.local");
    return null;
  }

  try {
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];

      // Fetch additional details including runtime
      const detailsUrl = `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`;
      const detailsResponse = await fetch(detailsUrl);
      const details = await detailsResponse.json();

      return {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        genre_ids: movie.genre_ids,
        runtime: details.runtime,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching movie "${title}":`, error);
    return null;
  }
}

function getGenreFromIds(genreIds: number[]): string | null {
  const genreMap: { [key: number]: string } = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  if (genreIds.length === 0) return null;
  return genreMap[genreIds[0]] || null;
}

async function enrichMovies(): Promise<EnrichedMovie[]> {
  const enrichedMovies: EnrichedMovie[] = [];

  console.log(`Fetching metadata for ${moviesList.length} movies...`);

  for (let i = 0; i < moviesList.length; i++) {
    const movie = moviesList[i];
    console.log(`[${i + 1}/${moviesList.length}] Fetching: ${movie.title} (${movie.year})`);

    const tmdbData = await searchMovie(movie.title, movie.year);

    const enriched: EnrichedMovie = {
      ...movie,
      tmdb_id: tmdbData?.id || null,
      poster_url: tmdbData?.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : null,
      genre: tmdbData?.genre_ids ? getGenreFromIds(tmdbData.genre_ids) : null,
      runtime: tmdbData?.runtime || null,
    };

    enrichedMovies.push(enriched);

    // Rate limiting: wait 250ms between requests
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  return enrichedMovies;
}

async function main() {
  const enrichedMovies = await enrichMovies();

  // Save to JSON file
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./scripts/seed-data/movies-enriched.json",
    JSON.stringify(enrichedMovies, null, 2)
  );

  console.log("\nDone! Enriched movie data saved to movies-enriched.json");
  console.log(`Successfully enriched ${enrichedMovies.filter(m => m.tmdb_id).length}/${enrichedMovies.length} movies`);
}

if (require.main === module) {
  main();
}
