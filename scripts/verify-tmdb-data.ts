/**
 * Verify TMDB data is in the database
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
  // Check first 3 movies with TMDB data
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("list_number", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error:", error);
    return;
  }

  const movies = data as Database["public"]["Tables"]["movies"]["Row"][];

  if (!movies || movies.length === 0) {
    console.error("No movies found");
    return;
  }

  console.log("\n🎬 TMDB Data Verification:\n");

  movies.forEach((movie) => {
    console.log(`#${movie.list_number}: ${movie.title} (${movie.year})`);
    console.log(`  Director: ${movie.director}`);
    console.log(`  TMDB ID: ${movie.tmdb_id || "❌ MISSING"}`);
    console.log(`  Genre: ${movie.genre || "N/A"}`);
    console.log(`  Runtime: ${movie.runtime ? `${movie.runtime} min` : "N/A"}`);
    console.log(`  Description: ${movie.description ? "✅" : "❌"}`);
    console.log(`  Watch Provider Link: ${movie.watch_provider_link ? "✅" : "❌"}`);
    if (movie.watch_provider_link) {
      console.log(`    → ${movie.watch_provider_link}`);
    }
    console.log("");
  });

  const withTMDB = movies.filter(m => m.tmdb_id).length;
  const withWatchProviders = movies.filter(m => m.watch_provider_link).length;

  console.log("📊 Summary:");
  console.log(`  - Movies with TMDB ID: ${withTMDB}/${movies.length}`);
  console.log(`  - Movies with watch providers: ${withWatchProviders}/${movies.length}`);

  if (withTMDB === movies.length && withWatchProviders > 0) {
    console.log("\n✅ TMDB migration successful!");
  } else {
    console.log("\n⚠️  Some TMDB data might be missing");
  }
}

verify().catch(console.error);
