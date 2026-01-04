/**
 * Script to clear all movies and albums from the database
 * Usage: npx tsx scripts/clear-database.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.types";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase credentials. Please check .env.local");
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function clearDatabase() {
  console.log("🗑️  Clearing database...\n");

  // Delete all movies
  const { error: moviesError } = await supabase
    .from("movies")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (moviesError) {
    console.error("Error deleting movies:", moviesError);
  } else {
    console.log("✅ Cleared all movies");
  }

  // Delete all albums
  const { error: albumsError } = await supabase
    .from("albums")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

  if (albumsError) {
    console.error("Error deleting albums:", albumsError);
  } else {
    console.log("✅ Cleared all albums");
  }

  console.log("\n✨ Database cleared successfully!");
}

clearDatabase().catch(console.error);
