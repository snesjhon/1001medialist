import { getUser } from "@/app/actions/auth";
import { getProgress } from "@/app/actions/pairs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MediaHeader } from "@/components/dashboard/MediaHeader";
import { PairCards } from "@/components/dashboard/PairCards";
import { CardsSkeleton } from "@/components/dashboard/CardsSkeleton";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

interface MediaPageProps {
  params: Promise<{
    number: string;
  }>;
}

export default async function MediaPage({ params }: MediaPageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const { number } = await params;
  const pairNumber = parseInt(number, 10);

  // Validate pair number
  if (isNaN(pairNumber) || pairNumber < 1 || pairNumber > 1001) {
    redirect("/dashboard");
  }

  const progressData = await getProgress(user.id);

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="space-y-8">
        {/* Static header - renders immediately */}
        <MediaHeader currentPairNumber={pairNumber} />

        {/* Album and Movie side-by-side - streaming */}
        <div className="grid gap-8 md:grid-cols-2 md:items-stretch">
          <Suspense fallback={<CardsSkeleton />}>
            <PairCards userId={user.id} pairNumber={pairNumber} />
          </Suspense>
        </div>

        {/* Progress bar at the bottom - full width */}
        <ProgressBar
          albumsCompleted={progressData.albumsCompleted}
          moviesCompleted={progressData.moviesCompleted}
          currentPairNumber={progressData.currentPairNumber}
        />
      </div>
    </div>
  );
}
