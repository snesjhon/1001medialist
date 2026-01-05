import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardContent className="flex-1">
        <div className="flex flex-col gap-6">
          {/* Album Cover */}
          {album.cover_url && (
            <div className="relative w-full h-80 max-w-md mx-auto overflow-hidden rounded-md">
              <Image
                src={album.cover_url}
                alt={`${album.title} cover`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Album Details */}
          <div className="space-y-4">
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
  );
}
