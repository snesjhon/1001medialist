import { getCurrentPair, getPairByNumber } from "@/app/actions/pairs";
import { AlbumCard } from "./AlbumCard";
import { MovieCard } from "./MovieCard";

interface PairCardsProps {
  userId: string;
  pairNumber?: number;
}

export async function PairCards({ userId, pairNumber }: PairCardsProps) {
  const pairData = pairNumber
    ? await getPairByNumber(userId, pairNumber)
    : await getCurrentPair(userId);

  if (!pairData) {
    return (
      <div className="col-span-2 rounded-lg border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">
          Unable to load pair data. Please try again.
        </p>
      </div>
    );
  }

  const { album, movie, userAlbum, userMovie } = pairData;

  return (
    <>
      <AlbumCard
        album={album}
        userAlbum={userAlbum}
        userId={userId}
      />

      <MovieCard
        movie={movie}
        userMovie={userMovie}
        userId={userId}
      />
    </>
  );
}
