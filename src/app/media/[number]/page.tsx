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
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="space-y-6">
          {/* Navigation header */}
          <MediaHeader currentPairNumber={pairNumber} />

          {/* Album and Movie cards side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<CardsSkeleton />}>
              <PairCards userId={user.id} pairNumber={pairNumber} />
            </Suspense>
          </div>

          {/* Progress section */}
          <ProgressBar
            albumsCompleted={progressData.albumsCompleted}
            moviesCompleted={progressData.moviesCompleted}
            currentPairNumber={progressData.currentPairNumber}
          />
        </div>
      </div>
    </div>
  );
}
