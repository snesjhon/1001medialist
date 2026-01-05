import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardsSkeleton() {
  return (
    <>
      {[1, 2].map((i) => (
        <Card key={i} className="h-full flex flex-col">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            {/* Fixed height image skeleton */}
            <Skeleton className="h-80 w-full max-w-md mx-auto rounded-md" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
