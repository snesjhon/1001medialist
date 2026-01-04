import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompleteButton } from "./CompleteButton";
import { SkipButton } from "./SkipButton";
import type { Database } from "@/types/database.types";

type Album = Database["public"]["Tables"]["albums"]["Row"];
type Movie = Database["public"]["Tables"]["movies"]["Row"];
type UserAlbum = Database["public"]["Tables"]["user_albums"]["Row"];
type UserMovie = Database["public"]["Tables"]["user_movies"]["Row"];

interface PairDisplayProps {
  album: Album | null;
  movie: Movie | null;
  userAlbum: UserAlbum | null;
  userMovie: UserMovie | null;
  userId: string;
}

export function PairDisplay({ album, movie, userAlbum, userMovie, userId }: PairDisplayProps) {
  if (!album || !movie) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No media found for this pair number. Please check your database.
          </p>
        </CardContent>
      </Card>
    );
  }

  const albumCompleted = userAlbum && (userAlbum.completed_at || userAlbum.skipped);
  const movieCompleted = userMovie && (userMovie.completed_at || userMovie.skipped);

  return (
    <div className="space-y-8">
      {/* Album Card */}
      <Card className={albumCompleted ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Album #{album.list_number}</CardTitle>
            {albumCompleted && (
              <Badge variant={userAlbum.skipped ? "secondary" : "default"}>
                {userAlbum.skipped ? "Skipped" : `Rated ${userAlbum.rating}★`}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Album Cover - Left Side */}
            {album.cover_url && (
              <div className="relative w-full md:w-64 h-64 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={album.cover_url}
                  alt={`${album.title} cover`}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Album Details - Right Side */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{album.title}</h3>
                <p className="text-lg text-muted-foreground">{album.artist}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{album.year}</Badge>
                  {album.genre && <Badge variant="outline">{album.genre}</Badge>}
                </div>
              </div>

              {album.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {album.description}
                </p>
              )}

              {album.spotify_id && (
                <a
                  href={`https://open.spotify.com/album/${album.spotify_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm text-primary hover:underline"
                >
                  Listen on Spotify →
                </a>
              )}
            </div>
          </div>
        </CardContent>
        {!albumCompleted && (
          <CardFooter className="flex gap-2">
            <CompleteButton
              type="album"
              itemId={album.id}
              userId={userId}
            />
            <SkipButton
              type="album"
              itemId={album.id}
              userId={userId}
            />
          </CardFooter>
        )}
      </Card>

      {/* Movie Card */}
      <Card className={movieCompleted ? "opacity-60" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">Movie #{movie.list_number}</CardTitle>
            {movieCompleted && (
              <Badge variant={userMovie.skipped ? "secondary" : "default"}>
                {userMovie.skipped ? "Skipped" : `Rated ${userMovie.rating}★`}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Movie Poster - Left Side */}
            {movie.poster_url && (
              <div className="relative w-full md:w-48 h-72 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={movie.poster_url}
                  alt={`${movie.title} poster`}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Movie Details - Right Side */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-bold">{movie.title}</h3>
                <p className="text-lg text-muted-foreground">{movie.director}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline">{movie.year}</Badge>
                  {movie.genre && <Badge variant="outline">{movie.genre}</Badge>}
                  {movie.runtime && <Badge variant="outline">{movie.runtime} min</Badge>}
                </div>
              </div>

              {movie.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              )}

              {movie.tmdb_id && (
                <a
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm text-primary hover:underline"
                >
                  View on TMDB →
                </a>
              )}
            </div>
          </div>
        </CardContent>
        {!movieCompleted && (
          <CardFooter className="flex gap-2">
            <CompleteButton
              type="movie"
              itemId={movie.id}
              userId={userId}
            />
            <SkipButton
              type="movie"
              itemId={movie.id}
              userId={userId}
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
