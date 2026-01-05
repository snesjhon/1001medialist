/**
 * Fetch TMDB data for movies including watch providers
 * Usage: npx tsx scripts/fetch-tmdb-data.ts [start] [end]
 * Example: npx tsx scripts/fetch-tmdb-data.ts 0 10
 */

import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env.local" });

// TMDB_API_KEY can be either the actual API key or the access token (JWT)
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

// Check if TMDB_API_KEY is actually a JWT token (access token)
const isAccessToken = TMDB_API_KEY?.startsWith("eyJ");
const accessToken = TMDB_ACCESS_TOKEN || (isAccessToken ? TMDB_API_KEY : null);
const apiKey = (!isAccessToken && TMDB_API_KEY) ? TMDB_API_KEY : null;

if (!accessToken && !apiKey) {
  throw new Error("Missing TMDB credentials. Please set TMDB_API_KEY or TMDB_ACCESS_TOKEN in .env.local");
}

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  genre_ids: number[];
  runtime?: number;
  overview: string;
}

interface TMDBSearchResult {
  results: TMDBMovie[];
}

interface TMDBMovieDetails {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number;
  overview: string;
}

interface TMDBWatchProvider {
  link: string;
  flatrate?: Array<{ provider_id: number; provider_name: string }>;
  rent?: Array<{ provider_id: number; provider_name: string }>;
  buy?: Array<{ provider_id: number; provider_name: string }>;
}

interface TMDBWatchProvidersResponse {
  results: {
    US?: TMDBWatchProvider;
  };
}

interface SourceMovie {
  title: string;
  director: string;
  year: number;
  list_number: number;
}

interface EnrichedMovie extends SourceMovie {
  tmdb_id: number | null;
  genre: string | null;
  poster_url: string | null;
  runtime: number | null;
  description: string | null;
  watch_provider_link: string | null;
}

async function searchMovie(title: string, year: number): Promise<TMDBMovie | null> {
  try {
    let url: string;
    let headers: Record<string, string> = {};

    if (accessToken) {
      url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title)}&year=${year}`;
      headers = {
        "Authorization": `Bearer ${accessToken}`,
        "accept": "application/json"
      };
    } else {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}&year=${year}`;
    }

    console.log(`Searching for: "${title}" (${year})`);

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json() as TMDBSearchResult;

    if (data.results && data.results.length > 0) {
      return data.results[0];
    }

    console.warn(`No TMDB results for: ${title} (${year})`);
    return null;
  } catch (error) {
    console.error(`Error searching for movie "${title}":`, error);
    return null;
  }
}

async function getMovieDetails(tmdbId: number): Promise<TMDBMovieDetails | null> {
  try {
    let url: string;
    let headers: Record<string, string> = {};

    if (accessToken) {
      url = `https://api.themoviedb.org/3/movie/${tmdbId}`;
      headers = {
        "Authorization": `Bearer ${accessToken}`,
        "accept": "application/json"
      };
    } else {
      url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`TMDB API error for movie ${tmdbId}: ${response.status}`);
      return null;
    }

    const data = await response.json() as TMDBMovieDetails;
    return data;
  } catch (error) {
    console.error(`Error fetching details for TMDB ID ${tmdbId}:`, error);
    return null;
  }
}

async function getWatchProviders(tmdbId: number): Promise<string | null> {
  try {
    let url: string;
    let headers: Record<string, string> = {};

    if (accessToken) {
      url = `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers`;
      headers = {
        "Authorization": `Bearer ${accessToken}`,
        "accept": "application/json"
      };
    } else {
      url = `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers?api_key=${apiKey}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error(`TMDB API error for watch providers ${tmdbId}: ${response.status}`);
      return null;
    }

    const data = await response.json() as TMDBWatchProvidersResponse;

    // Return the US watch provider link if available
    if (data.results?.US?.link) {
      return data.results.US.link;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching watch providers for TMDB ID ${tmdbId}:`, error);
    return null;
  }
}

async function enrichMovie(movie: SourceMovie): Promise<EnrichedMovie> {
  console.log(`\n[${movie.list_number}/${movie.list_number}] Processing: ${movie.title} (${movie.year})`);

  // Search for the movie
  const searchResult = await searchMovie(movie.title, movie.year);

  if (!searchResult) {
    return {
      ...movie,
      tmdb_id: null,
      genre: null,
      poster_url: null,
      runtime: null,
      description: null,
      watch_provider_link: null,
    };
  }

  // Get detailed movie information
  const details = await getMovieDetails(searchResult.id);

  // Get watch providers
  const watchProviderLink = await getWatchProviders(searchResult.id);

  const enriched: EnrichedMovie = {
    ...movie,
    tmdb_id: searchResult.id,
    genre: details?.genres[0]?.name || null,
    poster_url: searchResult.poster_path
      ? `https://image.tmdb.org/t/p/w600_and_h900_bestv2${searchResult.poster_path}`
      : null,
    runtime: details?.runtime || null,
    description: searchResult.overview || null,
    watch_provider_link: watchProviderLink,
  };

  if (watchProviderLink) {
    console.log(`✓ Found watch provider link`);
  } else {
    console.log(`⚠ No watch provider link available`);
  }

  return enriched;
}

async function main() {
  const startIndex = parseInt(process.argv[2] || "0");
  const endIndex = parseInt(process.argv[3] || "10");

  // Read the source movies data
  const sourceDataPath = path.join(__dirname, "seed-data", "movies-source.json");

  if (!fs.existsSync(sourceDataPath)) {
    throw new Error(`Source data not found at ${sourceDataPath}. Please ensure movies-source.json exists.`);
  }

  const sourceMovies: SourceMovie[] = JSON.parse(fs.readFileSync(sourceDataPath, "utf-8"));
  const selectedMovies = sourceMovies.slice(startIndex, endIndex);

  console.log(`\nFetching TMDB data for movies ${startIndex + 1} to ${endIndex}...`);
  console.log(`Total movies to process: ${selectedMovies.length}\n`);

  const enrichedMovies: EnrichedMovie[] = [];

  for (const movie of selectedMovies) {
    const enriched = await enrichMovie(movie);
    enrichedMovies.push(enriched);

    // Rate limiting: wait 250ms between requests to respect TMDB's rate limits
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  // Update the movies-list.ts file
  const outputPath = path.join(__dirname, "seed-data", "movies-list.ts");

  const fileContent = `/**
 * Source: "1001 Movies You Must See Before You Die" book
 * Metadata from: TMDB API
 *
 * This file is auto-generated by scripts/fetch-tmdb-data.ts
 */

export interface MovieSeed {
  title: string;
  director: string;
  year: number;
  list_number: number;
  genre?: string;
  poster_url?: string;
  runtime?: number;
  description?: string;
  tmdb_id?: number;
  watch_provider_link?: string;
}

export const moviesList: MovieSeed[] = [
${enrichedMovies.map(movie => `  { title: ${JSON.stringify(movie.title)}, director: ${JSON.stringify(movie.director)}, year: ${movie.year}, list_number: ${movie.list_number}${movie.genre ? `, genre: ${JSON.stringify(movie.genre)}` : ""}${movie.poster_url ? `, poster_url: ${JSON.stringify(movie.poster_url)}` : ""}${movie.runtime ? `, runtime: ${movie.runtime}` : ""}${movie.description ? `, description: ${JSON.stringify(movie.description)}` : ""}${movie.tmdb_id ? `, tmdb_id: ${movie.tmdb_id}` : ""}${movie.watch_provider_link ? `, watch_provider_link: ${JSON.stringify(movie.watch_provider_link)}` : ""} }`).join(",\n")}
];
`;

  fs.writeFileSync(outputPath, fileContent);

  console.log(`\n✅ Generated ${enrichedMovies.length} movies to ${outputPath}`);
  console.log(`\nMovies ${startIndex + 1}-${endIndex} complete!`);

  const withWatchProviders = enrichedMovies.filter(m => m.watch_provider_link).length;
  console.log(`\n📊 Statistics:`);
  console.log(`  - Movies with TMDB ID: ${enrichedMovies.filter(m => m.tmdb_id).length}/${enrichedMovies.length}`);
  console.log(`  - Movies with watch providers: ${withWatchProviders}/${enrichedMovies.length}`);
}

main().catch(console.error);
