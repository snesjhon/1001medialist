"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Shuffle } from "lucide-react";

interface MediaHeaderProps {
  currentPairNumber: number;
  isOnDashboard?: boolean;
}

export function MediaHeader({
  currentPairNumber,
  isOnDashboard = false,
}: MediaHeaderProps) {
  const router = useRouter();
  const hasPrevious = currentPairNumber > 1;
  const hasNext = currentPairNumber < 1001;

  const handleRandom = () => {
    const randomPair = Math.floor(Math.random() * 1001) + 1;
    router.push(`/media/${randomPair}`);
  };

  return (
    <div className="flex items-center justify-center gap-8 py-4">
      {/* Left actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild disabled={isOnDashboard}>
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
          </Link>
        </Button>

        <Button variant="outline" size="icon" onClick={handleRandom}>
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: Pair navigation */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild disabled={!hasPrevious}>
          <Link href={`/media/${currentPairNumber - 1}`}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="min-w-[140px] text-center">
          <div className="text-2xl font-bold">{currentPairNumber} / 1001</div>
        </div>

        <Button variant="outline" size="icon" asChild disabled={!hasNext}>
          <Link href={`/media/${currentPairNumber + 1}`}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Right spacer for balance */}
      <div className="w-[88px]"></div>
    </div>
  );
}
