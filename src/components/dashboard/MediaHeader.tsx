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
    <div className="flex items-center justify-between">
      {/* Left group: Current, Random */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="lg" asChild disabled={isOnDashboard}>
          <Link href="/dashboard">
            <Home className="h-5 w-5" />
          </Link>
        </Button>

        <Button variant="outline" size="lg" onClick={handleRandom}>
          <Shuffle className="h-2 w-2 " />
        </Button>
      </div>

      {/* Right group: Previous, Number, Next */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="lg" asChild disabled={!hasPrevious}>
          <Link href={`/media/${currentPairNumber - 1}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="text-3xl font-bold px-4">{currentPairNumber}/1001</div>

        <Button variant="outline" size="lg" asChild disabled={!hasNext}>
          <Link href={`/media/${currentPairNumber + 1}`}>
            <ChevronRight className="h-5 w-5 " />
          </Link>
        </Button>
      </div>
    </div>
  );
}
