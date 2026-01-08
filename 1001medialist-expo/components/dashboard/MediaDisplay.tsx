import { memo } from "react";
import { View } from "react-native";
import { AlbumCard } from "./AlbumCard";
import { MovieCard } from "./MovieCard";
import type { Album, Movie, UserAlbum, UserMovie } from "../../lib/supabase-queries";

interface MediaDisplayProps {
  album: Album | null;
  movie: Movie | null;
  userAlbum: UserAlbum | null;
  userMovie: UserMovie | null;
  userId: string;
  onUpdate: () => void;
}

export const MediaDisplay = memo(function MediaDisplay({
  album,
  movie,
  userAlbum,
  userMovie,
  userId,
  onUpdate,
}: MediaDisplayProps) {
  return (
    <View
      style={{
        maxWidth: 1280,
        marginHorizontal: "auto",
        width: "100%",
        padding: 32,
        paddingTop: 0,
      }}
    >
      {/* Album and Movie Cards - Grid Layout for Web */}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <View style={{ flex: 1, minWidth: 400 }}>
          <AlbumCard
            key={album?.id}
            album={album}
            userAlbum={userAlbum}
            userId={userId}
            onUpdate={onUpdate}
          />
        </View>
        <View style={{ flex: 1, minWidth: 400 }}>
          <MovieCard
            key={movie?.id}
            movie={movie}
            userMovie={userMovie}
            userId={userId}
            onUpdate={onUpdate}
          />
        </View>
      </View>
    </View>
  );
});
