import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">
              {totalCompleted} / {totalItems} ({progressPercent.toFixed(1)}%)
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Albums</p>
            <p className="text-2xl font-bold">{albumsCompleted}</p>
            <p className="text-xs text-muted-foreground">/ 1001</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Movies</p>
            <p className="text-2xl font-bold">{moviesCompleted}</p>
            <p className="text-xs text-muted-foreground">/ 1001</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">Current Pair</p>
          <p className="text-xl font-semibold">#{currentPairNumber}</p>
        </div>
      </CardContent>
    </Card>
  );
}
