"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserHistory(userId: string) {
  const supabase = await createClient();

  const [albumsResult, moviesResult] = await Promise.all([
    supabase
      .from("user_albums")
      .select("*, albums(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_movies")
      .select("*, movies(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  return {
    albums: albumsResult.data || [],
    movies: moviesResult.data || [],
  };
}
