import { getUser } from "../actions/auth";
import { getDetailedStats } from "../actions/stats";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GenreChart } from "@/components/stats/GenreChart";
import { Milestones } from "@/components/stats/Milestones";

export default async function StatsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const stats = await getDetailedStats(user.id);

  return (
    <div className="container py-8 max-w-7xl mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Stats</h1>
          <p className="text-muted-foreground">
            Track your progress and discover your preferences
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totals.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of 2002 items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Albums Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totals.albums}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of 1001 albums
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Movies Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totals.movies}</div>
              <p className="text-xs text-muted-foreground mt-1">
                of 1001 movies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {((stats.averages.albums + stats.averages.movies) / 2).toFixed(
                  1,
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                out of 5 stars
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Genre Breakdown */}
        <div className="grid gap-8 md:grid-cols-2">
          <GenreChart data={stats.genres.albums} title="Album Genres" />
          <GenreChart data={stats.genres.movies} title="Movie Genres" />
        </div>

        {/* Milestones */}
        <Milestones milestones={stats.milestones} />

        {/* Top Rated */}
        {(stats.topRated.albums.length > 0 ||
          stats.topRated.movies.length > 0) && (
          <div className="grid gap-8 md:grid-cols-2">
            {stats.topRated.albums.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>5-Star Albums</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.topRated.albums.map((album: any) => (
                      <div
                        key={album.id}
                        className="flex items-center gap-3 p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{album.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {album.artist} ({album.year})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {stats.topRated.movies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>5-Star Movies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.topRated.movies.map((movie: any) => (
                      <div
                        key={movie.id}
                        className="flex items-center gap-3 p-2 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{movie.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {movie.director} ({movie.year})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
