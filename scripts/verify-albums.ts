/**
 * Verify albums are in the database with iTunes metadata
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
  // Check first album
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("list_number", 1)
    .single();

  if (error) {
    console.error("Error:", error);
    return;
  }

  const album = data as Database["public"]["Tables"]["albums"]["Row"];

  if (!album) {
    console.error("No album found");
    return;
  }

  console.log("\n🎵 First Album Details:\n");
  console.log(`Title: ${album.title}`);
  console.log(`Artist: ${album.artist}`);
  console.log(`Year: ${album.year}`);
  console.log(`Genre: ${album.genre || "❌ NO GENRE"}`);
  console.log(`Cover URL: ${album.cover_url || "❌ NO COVER"}`);

  if (album.cover_url && album.genre) {
    console.log("\n✅ iTunes metadata successfully fetched and stored!");
  } else {
    console.log("\n❌ WARNING: Some metadata is missing!");
  }

  // Check total count
  const { count } = await supabase
    .from("albums")
    .select("*", { count: "exact", head: true });

  console.log(`\n📊 Total albums in database: ${count}`);
}

verify().catch(console.error);
