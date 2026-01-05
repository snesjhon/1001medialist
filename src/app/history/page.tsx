import { getUser } from "../actions/auth";
import { getUserHistory } from "../actions/history";
import { redirect } from "next/navigation";
import { HistoryList } from "@/components/history/HistoryList";

export default async function HistoryPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const history = await getUserHistory(user.id);

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your History</h1>
          <p className="text-muted-foreground">
            Browse all the albums and movies you&apos;ve experienced
          </p>
        </div>

        <HistoryList albums={history.albums} movies={history.movies} />
      </div>
    </div>
  );
}
