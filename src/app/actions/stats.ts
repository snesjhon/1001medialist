"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDetailedStats(userId: string) {
  const supabase = await createClient();

  // Get all completed items with their details
  const [userAlbumsResult, userMoviesResult, albumsResult, moviesResult] = await Promise.all([
    supabase
      .from("user_albums")
      .select("*, albums(*)")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .eq("skipped", false),
    supabase
      .from("user_movies")
      .select("*, movies(*)")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .eq("skipped", false),
    supabase.from("albums").select("genre"),
    supabase.from("movies").select("genre"),
  ]);

  const completedAlbums = userAlbumsResult.data || [];
  const completedMovies = userMoviesResult.data || [];

  // Calculate genre breakdowns
  const albumGenres: { [key: string]: number } = {};
  const movieGenres: { [key: string]: number } = {};

  completedAlbums.forEach((item: any) => {
    const genre = item.albums?.genre || "Unknown";
    albumGenres[genre] = (albumGenres[genre] || 0) + 1;
  });

  completedMovies.forEach((item: any) => {
    const genre = item.movies?.genre || "Unknown";
    movieGenres[genre] = (movieGenres[genre] || 0) + 1;
  });

  // Calculate average ratings
  const albumRatings = completedAlbums
    .filter((a: any) => a.rating)
    .map((a: any) => a.rating);
  const movieRatings = completedMovies
    .filter((m: any) => m.rating)
    .map((m: any) => m.rating);

  const avgAlbumRating =
    albumRatings.length > 0
      ? albumRatings.reduce((a: number, b: number) => a + b, 0) / albumRatings.length
      : 0;

  const avgMovieRating =
    movieRatings.length > 0
      ? movieRatings.reduce((a: number, b: number) => a + b, 0) / movieRatings.length
      : 0;

  // Find top rated items
  const topAlbums = [...completedAlbums]
    .filter((a: any) => a.rating === 5)
    .map((a: any) => a.albums)
    .slice(0, 5);

  const topMovies = [...completedMovies]
    .filter((m: any) => m.rating === 5)
    .map((m: any) => m.movies)
    .slice(0, 5);

  // Calculate milestones
  const totalCompleted = completedAlbums.length + completedMovies.length;
  const milestones = [
    { value: 10, label: "First 10", achieved: totalCompleted >= 10 },
    { value: 25, label: "Quarter Century", achieved: totalCompleted >= 25 },
    { value: 50, label: "Half Century", achieved: totalCompleted >= 50 },
    { value: 100, label: "Century", achieved: totalCompleted >= 100 },
    { value: 250, label: "Quarter Way", achieved: totalCompleted >= 250 },
    { value: 500, label: "Halfway There", achieved: totalCompleted >= 500 },
    { value: 1000, label: "Millennium", achieved: totalCompleted >= 1000 },
    { value: 2002, label: "Complete", achieved: totalCompleted >= 2002 },
  ];

  return {
    totals: {
      albums: completedAlbums.length,
      movies: completedMovies.length,
      total: totalCompleted,
    },
    averages: {
      albums: Number(avgAlbumRating.toFixed(1)),
      movies: Number(avgMovieRating.toFixed(1)),
    },
    genres: {
      albums: Object.entries(albumGenres).map(([name, value]) => ({
        name,
        value,
      })),
      movies: Object.entries(movieGenres).map(([name, value]) => ({
        name,
        value,
      })),
    },
    topRated: {
      albums: topAlbums,
      movies: topMovies,
    },
    milestones,
  };
}
