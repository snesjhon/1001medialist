/**
 * Apply migration to add watch_provider_link column
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/types/database.types";
import * as fs from "fs";
import * as path from "path";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  console.log("Applying migration: add watch_provider_link column...\n");

  const migrationPath = path.join(__dirname, "../supabase/migrations/00003_add_watch_provider_link.sql");
  const sql = fs.readFileSync(migrationPath, "utf-8");

  const { error } = await supabase.rpc("exec_sql", { sql_query: sql } as any);

  if (error) {
    console.error("Migration failed:", error);
    // Try direct SQL execution instead
    console.log("Trying alternative method...");
    const { error: altError } = await supabase.from("movies").select("watch_provider_link").limit(1) as any;

    if (altError && altError.message.includes("column") && altError.message.includes("does not exist")) {
      console.log("Column doesn't exist, this is expected. Migration needs to be applied via SQL editor in Supabase dashboard.");
      console.log("\nPlease run this SQL in your Supabase SQL editor:");
      console.log("---");
      console.log(sql);
      console.log("---");
    } else {
      console.log("✅ Column might already exist or migration not needed");
    }
  } else {
    console.log("✅ Migration applied successfully!");
  }
}

applyMigration().catch(console.error);
