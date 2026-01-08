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
