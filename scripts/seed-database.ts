/**
 * Script to seed the Supabase database with movie and album data
 *
 * Prerequisites:
 * 1. Populate scripts/seed-data/movies-list.ts with movie data
 * 2. Populate scripts/seed-data/albums-list.ts with album data
 * 3. Set up Supabase credentials in .env.local
 *
 * Usage: npx tsx scripts/seed-database.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.types";
import { moviesList } from "./seed-data/movies-list";
import { albumsList } from "./seed-data/albums-list";

// Load environment variables from .env.local
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin operations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase credentials. Please check .env.local");
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedMovies() {
  console.log(`Seeding ${moviesList.length} movies...`);

  const { data, error } = await supabase
    .from("movies")
    .upsert(
      moviesList.map((movie) => ({
        title: movie.title,
        director: movie.director,
        year: movie.year,
        genre: movie.genre || null,
        poster_url: movie.poster_url || null,
        tmdb_id: null, // We don't have TMDB IDs in the new format
        runtime: movie.runtime || null,
        description: movie.description || null,
        list_number: movie.list_number,
      })) as any,
      { onConflict: "list_number" }
    );

  if (error) {
    console.error("Error seeding movies:", error);
    throw error;
  } else {
    console.log(`✅ Successfully seeded ${moviesList.length} movies`);
  }
}

async function seedAlbums() {
  console.log(`Seeding ${albumsList.length} albums...`);

  const { data, error } = await supabase
    .from("albums")
    .upsert(
      albumsList.map((album) => ({
        title: album.title,
        artist: album.artist,
        year: album.year,
        genre: null, // Will be populated later
        cover_url: null, // Will be populated later
        spotify_id: null, // Will be populated later
        description: null, // Will be populated later
        list_number: album.list_number,
      })) as any,
      { onConflict: "list_number" }
    );

  if (error) {
    console.error("Error seeding albums:", error);
    throw error;
  } else {
    console.log(`✅ Successfully seeded ${albumsList.length} albums`);
  }
}

async function main() {
  console.log("Starting database seeding...\n");

  await seedMovies();
  await seedAlbums();

  console.log("\nDatabase seeding complete!");
}

if (require.main === module) {
  main();
}
