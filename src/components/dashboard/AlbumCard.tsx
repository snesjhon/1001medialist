import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompleteButton } from "./CompleteButton";
import { SkipButton } from "./SkipButton";
import type { Database } from "@/types/database.types";

type Album = Database["public"]["Tables"]["albums"]["Row"];
type UserAlbum = Database["public"]["Tables"]["user_albums"]["Row"];

interface AlbumCardProps {
  album: Album | null;
  userAlbum: UserAlbum | null;
  userId: string;
}

export function AlbumCard({ album, userAlbum, userId }: AlbumCardProps) {
  if (!album) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No album found for this pair number.
          </p>
        </CardContent>
      </Card>
    );
  }

  const albumCompleted = userAlbum && (userAlbum.completed_at || userAlbum.skipped);

  return (
    <Card className={`h-full flex flex-col ${albumCompleted ? "opacity-60" : ""}`}>
      <CardContent className="flex-1 p-6">
        <div className="flex flex-col h-full">
          {/* Album Cover */}
          {album.cover_url && (
            <div className="relative w-full h-[600px] mb-4 overflow-hidden rounded-md flex items-center justify-center bg-muted/20">
              <Image
                src={album.cover_url}
                alt={`${album.title} cover`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Completion badge */}
          {albumCompleted && (
            <Badge
              variant={userAlbum.skipped ? "secondary" : "default"}
              className="w-fit mb-3"
            >
              {userAlbum.skipped ? "Skipped" : `Rated ${userAlbum.rating}★`}
            </Badge>
          )}

          {/* Album Details */}
          <div className="space-y-3">
            <div>
              <h3 className="text-2xl font-bold">{album.title}</h3>
              <p className="text-lg text-muted-foreground">{album.artist}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{album.year}</Badge>
              {album.genre && <Badge variant="outline">{album.genre}</Badge>}
            </div>

            {album.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {album.description}
              </p>
            )}

            {album.spotify_id && (
              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://open.spotify.com/album/${album.spotify_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex text-sm font-medium text-primary hover:underline"
                >
                  Listen on Spotify →
                </a>
              </div>
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
  );
}
