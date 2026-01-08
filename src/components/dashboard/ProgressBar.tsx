import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  albumsCompleted: number;
  moviesCompleted: number;
  currentPairNumber: number;
}

export function ProgressBar({
  albumsCompleted,
  moviesCompleted,
  currentPairNumber,
}: ProgressBarProps) {
  const totalCompleted = albumsCompleted + moviesCompleted;
  const totalItems = 2002; // 1001 albums + 1001 movies
  const progressPercent = (totalCompleted / totalItems) * 100;

  return (
    <div className="border-t pt-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Progress</h3>
          <p className="text-sm text-muted-foreground">
            {totalCompleted} / {totalItems} items ({progressPercent.toFixed(1)}%)
          </p>
        </div>

        <Progress value={progressPercent} className="h-3" />

        <div className="grid grid-cols-3 gap-6 pt-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Albums</p>
            <p className="text-3xl font-bold">{albumsCompleted}</p>
            <p className="text-xs text-muted-foreground">of 1001</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Movies</p>
            <p className="text-3xl font-bold">{moviesCompleted}</p>
            <p className="text-xs text-muted-foreground">of 1001</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Current Pair</p>
            <p className="text-3xl font-bold">#{currentPairNumber}</p>
            <p className="text-xs text-muted-foreground">of 1001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
