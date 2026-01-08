import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompleteButton } from "./CompleteButton";
import { SkipButton } from "./SkipButton";
import type { Database } from "@/types/database.types";

type Movie = Database["public"]["Tables"]["movies"]["Row"];
type UserMovie = Database["public"]["Tables"]["user_movies"]["Row"];

interface MovieCardProps {
  movie: Movie | null;
  userMovie: UserMovie | null;
  userId: string;
}

export function MovieCard({ movie, userMovie, userId }: MovieCardProps) {
  if (!movie) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No movie found for this pair number.
          </p>
        </CardContent>
      </Card>
    );
  }

  const movieCompleted =
    userMovie && (userMovie.completed_at || userMovie.skipped);

  return (
    <Card
      className={`h-full flex flex-col ${movieCompleted ? "opacity-60" : ""}`}
    >
      <CardContent className="flex-1 p-6">
        <div className="flex flex-col h-full">
          {/* Movie Poster */}
          {movie.poster_url && (
            <div className="relative w-full h-[600px] mb-4 overflow-hidden rounded-md flex items-center justify-center bg-muted/20">
              <Image
                src={movie.poster_url}
                alt={`${movie.title} poster`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Completion badge */}
          {movieCompleted && (
            <Badge
              variant={userMovie.skipped ? "secondary" : "default"}
              className="w-fit mb-3"
            >
              {userMovie.skipped ? "Skipped" : `Rated ${userMovie.rating}★`}
            </Badge>
          )}

          {/* Movie Details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-bold">{movie.title}</h3>
              <p className="text-lg text-muted-foreground">{movie.director}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{movie.year}</Badge>
              {movie.genre && <Badge variant="outline">{movie.genre}</Badge>}
              {movie.runtime && (
                <Badge variant="outline">{movie.runtime} min</Badge>
              )}
            </div>

            {movie.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {movie.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {movie.watch_provider_link && (
                <a
                  href={movie.watch_provider_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Where to Watch →
                </a>
              )}
              {movie.tmdb_id && (
                <a
                  href={`https://www.themoviedb.org/movie/${movie.tmdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm text-muted-foreground hover:text-primary hover:underline"
                >
                  TMDB →
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      {!movieCompleted && (
        <CardFooter className="flex gap-2">
          <CompleteButton type="movie" itemId={movie.id} userId={userId} />
          <SkipButton type="movie" itemId={movie.id} userId={userId} />
        </CardFooter>
      )}
    </Card>
  );
}
