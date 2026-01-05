/**
 * Add watch_provider_link column to movies table
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function addColumn() {
  console.log("Adding watch_provider_link column to movies table...\n");

  try {
    // Try to select the column first to see if it exists
    const { error: checkError } = await supabase
      .from("movies")
      .select("watch_provider_link")
      .limit(1);

    if (!checkError) {
      console.log("✅ Column 'watch_provider_link' already exists!");
      return;
    }

    console.log("Column doesn't exist yet.");
    console.log("\n⚠️  Please run this SQL in your Supabase SQL Editor:");
    console.log("---");
    console.log("ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS watch_provider_link text;");
    console.log("---\n");
    console.log("Then run this script again to verify.");
  } catch (error) {
    console.error("Error:", error);
  }
}

addColumn().catch(console.error);
