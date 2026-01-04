import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface Milestone {
  value: number;
  label: string;
  achieved: boolean;
}

interface MilestonesProps {
  milestones: Milestone[];
}

export function Milestones({ milestones }: MilestonesProps) {
  const achievedCount = milestones.filter((m) => m.achieved).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {achievedCount} of {milestones.length} achieved
        </p>
        <div className="space-y-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.value}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                milestone.achieved
                  ? "bg-primary/5 border-primary/20"
                  : "opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    milestone.achieved
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {milestone.achieved ? "✓" : "•"}
                </div>
                <div>
                  <p className="font-medium">{milestone.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {milestone.value} items
                  </p>
                </div>
              </div>
              {milestone.achieved && (
                <Badge variant="default">Achieved</Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
