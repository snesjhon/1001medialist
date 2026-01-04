import { getUser } from "../actions/auth";
import { getCurrentPair, getProgress } from "../actions/pairs";
import { redirect } from "next/navigation";
import { PairDisplay } from "@/components/dashboard/PairDisplay";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const [pairData, progressData] = await Promise.all([
    getCurrentPair(user.id),
    getProgress(user.id),
  ]);

  if (!pairData) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-lg text-muted-foreground">
            Unable to load your data. Please ensure your profile is set up correctly.
          </p>
        </div>
      </div>
    );
  }

  const { album, movie, userAlbum, userMovie } = pairData;

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-bold mb-2">Your Current Pair</h1>
          <p className="text-muted-foreground">
            Experience this album and movie, then rate or skip them to continue.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <PairDisplay
            album={album}
            movie={movie}
            userAlbum={userAlbum}
            userMovie={userMovie}
            userId={user.id}
          />

          <div className="space-y-4">
            <ProgressBar
              albumsCompleted={progressData.albumsCompleted}
              moviesCompleted={progressData.moviesCompleted}
              currentPairNumber={progressData.currentPairNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
