/**
 * Verify descriptions are in the database
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
  // Check first movie with description
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("list_number", 1)
    .single();

  const movie = data as Database["public"]["Tables"]["movies"]["Row"] | null;

  if (error) {
    console.error("Error:", error);
    return;
  }

  if (!movie) {
    console.error("No movie found");
    return;
  }

  console.log("\n🎬 First Movie Details:\n");
  console.log(`Title: ${movie.title}`);
  console.log(`Director: ${movie.director}`);
  console.log(`Year: ${movie.year}`);
  console.log(`Genre: ${movie.genre}`);
  console.log(`Runtime: ${movie.runtime} minutes`);
  console.log(`\nDescription: ${movie.description || "❌ NO DESCRIPTION"}`);

  if (movie.description) {
    console.log("\n✅ Descriptions are successfully stored in the database!");
  } else {
    console.log("\n❌ WARNING: Description is missing!");
  }
}

verify().catch(console.error);
