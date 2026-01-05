/**
 * Quick script to verify seeded data
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.types";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verify() {
  // Check movies
  const { data: moviesData, error: movieError } = await supabase
    .from("movies")
    .select("*")
    .order("list_number", { ascending: true })
    .limit(5);

  const movies = moviesData as Database["public"]["Tables"]["movies"]["Row"][] | null;

  if (movieError) {
    console.error("Error fetching movies:", movieError);
  } else {
    console.log("\n📽️  First 5 Movies in Database:");
    movies?.forEach((movie) => {
      console.log(`  ${movie.list_number}. ${movie.title} (${movie.year}) - ${movie.director}`);
    });
    console.log(`\n  Total movies found: ${movies?.length || 0}`);
  }

  // Check albums
  const { data: albumsData, error: albumError } = await supabase
    .from("albums")
    .select("*")
    .order("list_number", { ascending: true })
    .limit(5);

  const albums = albumsData as Database["public"]["Tables"]["albums"]["Row"][] | null;

  if (albumError) {
    console.error("Error fetching albums:", albumError);
  } else {
    console.log("\n🎵 First 5 Albums in Database:");
    albums?.forEach((album) => {
      console.log(`  ${album.list_number}. ${album.title} by ${album.artist} (${album.year})`);
    });
    console.log(`\n  Total albums found: ${albums?.length || 0}`);
  }

  // Check total counts
  const { count: movieCount } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true });

  const { count: albumCount } = await supabase
    .from("albums")
    .select("*", { count: "exact", head: true });

  console.log("\n📊 Database Totals:");
  console.log(`  Movies: ${movieCount}`);
  console.log(`  Albums: ${albumCount}`);
  console.log("\n✅ Data verification complete!");
}

verify().catch(console.error);
