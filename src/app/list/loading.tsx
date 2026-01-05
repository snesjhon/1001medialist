import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ListLoading() {
  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* List items skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-[auto_1fr_1fr] items-center">
                  {/* Pair number */}
                  <Skeleton className="h-8 w-16" />

                  {/* Album */}
                  <div className="flex gap-4 items-center">
                    {/* Album cover skeleton */}
                    <Skeleton className="w-24 h-24 flex-shrink-0 rounded-md" />
                    <div className="space-y-2 flex-1 min-w-0">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </div>

                  {/* Movie */}
                  <div className="flex gap-4 items-center">
                    {/* Movie poster skeleton */}
                    <Skeleton className="w-24 h-24 flex-shrink-0 rounded-md" />
                    <div className="space-y-2 flex-1 min-w-0">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  );
}
