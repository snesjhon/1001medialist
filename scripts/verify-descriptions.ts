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
  const { data: movies, error } = await supabase
    .from("movies")
    .select("title, year, director, description, runtime, genre")
    .eq("list_number", 1)
    .single();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("\n🎬 First Movie Details:\n");
    console.log(`Title: ${movies.title}`);
    console.log(`Director: ${movies.director}`);
    console.log(`Year: ${movies.year}`);
    console.log(`Genre: ${movies.genre}`);
    console.log(`Runtime: ${movies.runtime} minutes`);
    console.log(`\nDescription: ${movies.description || "❌ NO DESCRIPTION"}`);

    if (movies.description) {
      console.log("\n✅ Descriptions are successfully stored in the database!");
    } else {
      console.log("\n❌ WARNING: Description is missing!");
    }
  }
}

verify().catch(console.error);
