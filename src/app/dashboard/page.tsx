import { getUser } from "../actions/auth";
import { getProgress } from "../actions/pairs";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MediaHeader } from "@/components/dashboard/MediaHeader";
import { PairCards } from "@/components/dashboard/PairCards";
import { CardsSkeleton } from "@/components/dashboard/CardsSkeleton";
import { ProgressBar } from "@/components/dashboard/ProgressBar";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const progressData = await getProgress(user.id);
  const currentPairNumber = progressData.currentPairNumber;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-4">
        <div className="space-y-6">
          {/* Navigation header */}
          <MediaHeader currentPairNumber={currentPairNumber} isOnDashboard={true} />

          {/* Album and Movie cards side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<CardsSkeleton />}>
              <PairCards userId={user.id} />
            </Suspense>
          </div>

          {/* Progress section */}
          <ProgressBar
            albumsCompleted={progressData.albumsCompleted}
            moviesCompleted={progressData.moviesCompleted}
            currentPairNumber={currentPairNumber}
          />
        </div>
      </div>
    </div>
  );
}
