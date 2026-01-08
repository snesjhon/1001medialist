import { supabase } from './supabase';

export interface Album {
  id: string;
  list_number: number;
  title: string;
  artist: string;
  year: number;
  genre?: string;
  cover_url?: string;
  description?: string;
  spotify_id?: string;
}

export interface Movie {
  id: string;
  list_number: number;
  title: string;
  director: string;
  year: number;
  genre?: string;
  runtime?: number;
  poster_url?: string;
  description?: string;
  tmdb_id?: string;
  watch_provider_link?: string;
}

export interface UserAlbum {
  id: string;
  user_id: string;
  album_id: string;
  rating: number | null;
  notes: string | null;
  completed_at: string | null;
  skipped: boolean;
}

export interface UserMovie {
  id: string;
  user_id: string;
  movie_id: string;
  rating: number | null;
  notes: string | null;
  completed_at: string | null;
  skipped: boolean;
}

export interface Profile {
  user_id: string;
  current_pair_number: number;
}

export async function getCurrentPair(userId: string) {
  // Get user's profile to find current pair number
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (profileError || !profile) {
    return null;
  }

  const pairNumber = profile.current_pair_number;
  const pairData = await getPairByNumber(userId, pairNumber);

  if (!pairData) {
    return null;
  }

  return {
    profile,
    ...pairData,
  };
}

export async function getPairByNumber(userId: string, pairNumber: number) {
  // Fetch the album and movie for this pair number
  const [albumResult, movieResult] = await Promise.all([
    supabase
      .from('albums')
      .select('*')
      .eq('list_number', pairNumber)
      .single(),
    supabase
      .from('movies')
      .select('*')
      .eq('list_number', pairNumber)
      .single(),
  ]);

  // Check if user has already completed these
  const [userAlbumResult, userMovieResult] = await Promise.all([
    supabase
      .from('user_albums')
      .select('*')
      .eq('user_id', userId)
      .eq('album_id', albumResult.data?.id || '')
      .maybeSingle(),
    supabase
      .from('user_movies')
      .select('*')
      .eq('user_id', userId)
      .eq('movie_id', movieResult.data?.id || '')
      .maybeSingle(),
  ]);

  return {
    album: albumResult.data as Album | null,
    movie: movieResult.data as Movie | null,
    userAlbum: userAlbumResult.data as UserAlbum | null,
    userMovie: userMovieResult.data as UserMovie | null,
  };
}

export async function completeAlbum(
  userId: string,
  albumId: string,
  rating: number,
  notes?: string
) {
  const { error } = await supabase.from('user_albums').upsert({
    user_id: userId,
    album_id: albumId,
    rating,
    notes: notes || null,
    completed_at: new Date().toISOString(),
    skipped: false,
  });

  if (error) throw error;
  await checkAndAdvancePair(userId);
}

export async function completeMovie(
  userId: string,
  movieId: string,
  rating: number,
  notes?: string
) {
  const { error } = await supabase.from('user_movies').upsert({
    user_id: userId,
    movie_id: movieId,
    rating,
    notes: notes || null,
    completed_at: new Date().toISOString(),
    skipped: false,
  });

  if (error) throw error;
  await checkAndAdvancePair(userId);
}

export async function skipAlbum(userId: string, albumId: string) {
  const { error } = await supabase.from('user_albums').upsert({
    user_id: userId,
    album_id: albumId,
    skipped: true,
    rating: null,
    notes: null,
    completed_at: null,
  });

  if (error) throw error;
  await checkAndAdvancePair(userId);
}

export async function skipMovie(userId: string, movieId: string) {
  const { error } = await supabase.from('user_movies').upsert({
    user_id: userId,
    movie_id: movieId,
    skipped: true,
    rating: null,
    notes: null,
    completed_at: null,
  });

  if (error) throw error;
  await checkAndAdvancePair(userId);
}

async function checkAndAdvancePair(userId: string) {
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
      .from('profiles')
      .update({ current_pair_number: nextPairNumber })
      .eq('user_id', userId);
  }
}

export async function getProgress(userId: string) {
  const [albumsResult, moviesResult, profileResult] = await Promise.all([
    supabase
      .from('user_albums')
      .select('*')
      .eq('user_id', userId)
      .eq('skipped', false)
      .not('completed_at', 'is', null),
    supabase
      .from('user_movies')
      .select('*')
      .eq('user_id', userId)
      .eq('skipped', false)
      .not('completed_at', 'is', null),
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single(),
  ]);

  return {
    albumsCompleted: albumsResult.data?.length || 0,
    moviesCompleted: moviesResult.data?.length || 0,
    currentPairNumber: profileResult.data?.current_pair_number || 1,
  };
}

export interface AlbumWithUserData extends Album {
  user_album: UserAlbum | null;
}

export interface MovieWithUserData extends Movie {
  user_movie: UserMovie | null;
}

export interface MediaPair {
  pair_number: number;
  album: AlbumWithUserData | null;
  movie: MovieWithUserData | null;
}

export interface UserStats {
  totalPairs: number;
  albumsCompleted: number;
  moviesCompleted: number;
  albumsSkipped: number;
  moviesSkipped: number;
  pairsCompleted: number;
  averageAlbumRating: number;
  averageMovieRating: number;
  topRatedAlbums: Array<{ album: Album; rating: number }>;
  topRatedMovies: Array<{ movie: Movie; rating: number }>;
  recentCompletions: Array<{
    type: 'album' | 'movie';
    item: Album | Movie;
    rating: number;
    completed_at: string;
  }>;
  albumsByDecade: Record<string, number>;
  moviesByDecade: Record<string, number>;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  // Fetch all user data in parallel
  const [
    albumsResult,
    moviesResult,
    userAlbumsResult,
    userMoviesResult,
  ] = await Promise.all([
    supabase.from('albums').select('*'),
    supabase.from('movies').select('*'),
    supabase
      .from('user_albums')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('user_movies')
      .select('*')
      .eq('user_id', userId),
  ]);

  const albums = albumsResult.data || [];
  const movies = moviesResult.data || [];
  const userAlbums = userAlbumsResult.data || [];
  const userMovies = userMoviesResult.data || [];

  // Create maps for quick lookup
  const albumsMap = new Map(albums.map((a) => [a.id, a]));
  const moviesMap = new Map(movies.map((m) => [m.id, m]));

  // Filter completed items
  const completedAlbums = userAlbums.filter(
    (ua) => ua.completed_at && !ua.skipped
  );
  const completedMovies = userMovies.filter(
    (um) => um.completed_at && !um.skipped
  );
  const skippedAlbums = userAlbums.filter((ua) => ua.skipped);
  const skippedMovies = userMovies.filter((um) => um.skipped);

  // Calculate average ratings
  const albumRatings = completedAlbums
    .filter((ua) => ua.rating !== null)
    .map((ua) => ua.rating as number);
  const movieRatings = completedMovies
    .filter((um) => um.rating !== null)
    .map((um) => um.rating as number);

  const averageAlbumRating =
    albumRatings.length > 0
      ? albumRatings.reduce((a, b) => a + b, 0) / albumRatings.length
      : 0;

  const averageMovieRating =
    movieRatings.length > 0
      ? movieRatings.reduce((a, b) => a + b, 0) / movieRatings.length
      : 0;

  // Get top rated items
  const topRatedAlbums = completedAlbums
    .filter((ua) => ua.rating !== null)
    .map((ua) => ({
      album: albumsMap.get(ua.album_id)!,
      rating: ua.rating as number,
    }))
    .filter((item) => item.album)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const topRatedMovies = completedMovies
    .filter((um) => um.rating !== null)
    .map((um) => ({
      movie: moviesMap.get(um.movie_id)!,
      rating: um.rating as number,
    }))
    .filter((item) => item.movie)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Get recent completions
  const recentAlbums = completedAlbums
    .map((ua) => ({
      type: 'album' as const,
      item: albumsMap.get(ua.album_id)!,
      rating: ua.rating as number,
      completed_at: ua.completed_at as string,
    }))
    .filter((item) => item.item);

  const recentMovies = completedMovies
    .map((um) => ({
      type: 'movie' as const,
      item: moviesMap.get(um.movie_id)!,
      rating: um.rating as number,
      completed_at: um.completed_at as string,
    }))
    .filter((item) => item.item);

  const recentCompletions = [...recentAlbums, ...recentMovies]
    .sort(
      (a, b) =>
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    )
    .slice(0, 10);

  // Calculate by decade
  const albumsByDecade: Record<string, number> = {};
  completedAlbums.forEach((ua) => {
    const album = albumsMap.get(ua.album_id);
    if (album) {
      const decade = Math.floor(album.year / 10) * 10;
      albumsByDecade[`${decade}s`] = (albumsByDecade[`${decade}s`] || 0) + 1;
    }
  });

  const moviesByDecade: Record<string, number> = {};
  completedMovies.forEach((um) => {
    const movie = moviesMap.get(um.movie_id);
    if (movie) {
      const decade = Math.floor(movie.year / 10) * 10;
      moviesByDecade[`${decade}s`] = (moviesByDecade[`${decade}s`] || 0) + 1;
    }
  });

  // Count pairs where both are completed
  const completedAlbumIds = new Set(completedAlbums.map((ua) => ua.album_id));
  const completedMovieIds = new Set(completedMovies.map((um) => um.movie_id));

  let pairsCompleted = 0;
  albums.forEach((album) => {
    const movie = movies.find((m) => m.list_number === album.list_number);
    if (
      movie &&
      completedAlbumIds.has(album.id) &&
      completedMovieIds.has(movie.id)
    ) {
      pairsCompleted++;
    }
  });

  return {
    totalPairs: 1001,
    albumsCompleted: completedAlbums.length,
    moviesCompleted: completedMovies.length,
    albumsSkipped: skippedAlbums.length,
    moviesSkipped: skippedMovies.length,
    pairsCompleted,
    averageAlbumRating: Math.round(averageAlbumRating * 10) / 10,
    averageMovieRating: Math.round(averageMovieRating * 10) / 10,
    topRatedAlbums,
    topRatedMovies,
    recentCompletions,
    albumsByDecade,
    moviesByDecade,
  };
}

export async function getAllPairs(userId: string): Promise<MediaPair[]> {
  // Fetch all albums and movies
  const [albumsResult, moviesResult, userAlbumsResult, userMoviesResult] = await Promise.all([
    supabase
      .from('albums')
      .select('*')
      .order('list_number', { ascending: true }),
    supabase
      .from('movies')
      .select('*')
      .order('list_number', { ascending: true }),
    supabase
      .from('user_albums')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('user_movies')
      .select('*')
      .eq('user_id', userId),
  ]);

  if (albumsResult.error) throw albumsResult.error;
  if (moviesResult.error) throw moviesResult.error;

  const albums = albumsResult.data || [];
  const movies = moviesResult.data || [];
  const userAlbums = userAlbumsResult.data || [];
  const userMovies = userMoviesResult.data || [];

  // Create maps for quick lookup
  const userAlbumsMap = new Map<string, UserAlbum>();
  userAlbums.forEach((ua) => userAlbumsMap.set(ua.album_id, ua));

  const userMoviesMap = new Map<string, UserMovie>();
  userMovies.forEach((um) => userMoviesMap.set(um.movie_id, um));

  const albumsMap = new Map<number, Album>();
  albums.forEach((album) => albumsMap.set(album.list_number, album));

  const moviesMap = new Map<number, Movie>();
  movies.forEach((movie) => moviesMap.set(movie.list_number, movie));

  // Create pairs for all 1001 entries
  const pairs: MediaPair[] = [];
  for (let i = 1; i <= 1001; i++) {
    const album = albumsMap.get(i);
    const movie = moviesMap.get(i);

    pairs.push({
      pair_number: i,
      album: album
        ? {
            ...album,
            user_album: userAlbumsMap.get(album.id) || null,
          }
        : null,
      movie: movie
        ? {
            ...movie,
            user_movie: userMoviesMap.get(movie.id) || null,
          }
        : null,
    });
  }

  return pairs;
}
