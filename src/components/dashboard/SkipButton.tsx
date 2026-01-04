"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { skipAlbum, skipMovie } from "@/app/actions/pairs";

interface SkipButtonProps {
  type: "album" | "movie";
  itemId: string;
  userId: string;
}

export function SkipButton({ type, itemId, userId }: SkipButtonProps) {
  const [isSkipping, setIsSkipping] = useState(false);

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      if (type === "album") {
        await skipAlbum(userId, itemId);
      } else {
        await skipMovie(userId, itemId);
      }
    } catch (error) {
      console.error("Error skipping:", error);
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleSkip}
      disabled={isSkipping}
      className="flex-1"
    >
      {isSkipping ? "Skipping..." : "Skip"}
    </Button>
  );
}
