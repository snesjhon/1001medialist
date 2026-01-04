"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";
import { revalidatePath } from "next/cache";

type Album = Database["public"]["Tables"]["albums"]["Row"];
type Movie = Database["public"]["Tables"]["movies"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getCurrentPair(userId: string) {
  const supabase = await createClient();

  // Get user's profile to find current pair number
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profile) {
    return null;
  }

  const pairNumber = profile.current_pair_number;

  // Fetch the album and movie for this pair number
  const [albumResult, movieResult] = await Promise.all([
    supabase
      .from("albums")
      .select("*")
      .eq("list_number", pairNumber)
      .single(),
    supabase
      .from("movies")
      .select("*")
      .eq("list_number", pairNumber)
      .single(),
  ]);

  // Check if user has already completed these
  const [userAlbumResult, userMovieResult] = await Promise.all([
    supabase
      .from("user_albums")
      .select("*")
      .eq("user_id", userId)
      .eq("album_id", albumResult.data?.id || "")
      .maybeSingle(),
    supabase
      .from("user_movies")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieResult.data?.id || "")
      .maybeSingle(),
  ]);

  return {
    profile,
    album: albumResult.data,
    movie: movieResult.data,
    userAlbum: userAlbumResult.data,
    userMovie: userMovieResult.data,
  };
}

export async function completeAlbum(
  userId: string,
  albumId: string,
  rating: number,
  notes?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_albums").upsert({
    user_id: userId,
    album_id: albumId,
    rating,
    notes: notes || null,
    completed_at: new Date().toISOString(),
    skipped: false,
  });

  if (error) throw error;

  await checkAndAdvancePair(userId);
  revalidatePath("/dashboard");
}

export async function completeMovie(
  userId: string,
  movieId: string,
  rating: number,
  notes?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_movies").upsert({
    user_id: userId,
    movie_id: movieId,
    rating,
    notes: notes || null,
    completed_at: new Date().toISOString(),
    skipped: false,
  });

  if (error) throw error;

  await checkAndAdvancePair(userId);
  revalidatePath("/dashboard");
}

export async function skipAlbum(userId: string, albumId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_albums").upsert({
    user_id: userId,
    album_id: albumId,
    skipped: true,
    rating: null,
    notes: null,
    completed_at: null,
  });

  if (error) throw error;

  await checkAndAdvancePair(userId);
  revalidatePath("/dashboard");
}

export async function skipMovie(userId: string, movieId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_movies").upsert({
    user_id: userId,
    movie_id: movieId,
    skipped: true,
    rating: null,
    notes: null,
    completed_at: null,
  });

  if (error) throw error;

  await checkAndAdvancePair(userId);
  revalidatePath("/dashboard");
}

async function checkAndAdvancePair(userId: string) {
  const supabase = await createClient();

  const currentPair = await getCurrentPair(userId);
  if (!currentPair) return;

  const { album, movie, userAlbum, userMovie, profile } = currentPair;

  // Check if both album and movie are either completed or skipped
  const albumDone = userAlbum && (userAlbum.completed_at || userAlbum.skipped);
  const movieDone = userMovie && (userMovie.completed_at || userMovie.skipped);

  if (albumDone && movieDone) {
    // Advance to next pair
    const nextPairNumber = Math.min(profile.current_pair_number + 1, 1001);

    await supabase
      .from("profiles")
      .update({ current_pair_number: nextPairNumber })
      .eq("user_id", userId);
  }
}

export async function getProgress(userId: string) {
  const supabase = await createClient();

  const [albumsResult, moviesResult, profile] = await Promise.all([
    supabase
      .from("user_albums")
      .select("*")
      .eq("user_id", userId)
      .eq("skipped", false)
      .not("completed_at", "is", null),
    supabase
      .from("user_movies")
      .select("*")
      .eq("user_id", userId)
      .eq("skipped", false)
      .not("completed_at", "is", null),
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single(),
  ]);

  return {
    albumsCompleted: albumsResult.data?.length || 0,
    moviesCompleted: moviesResult.data?.length || 0,
    currentPairNumber: profile.data?.current_pair_number || 1,
  };
}
