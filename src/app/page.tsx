import { getUser } from "./actions/auth";
import { SignInButton } from "@/components/auth/SignInButton";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            1001 Movies & Albums
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground">
            Discover and track your journey through 1001 essential movies and
            albums
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sign up with your Google account and get presented with sequential
            pairs of albums and movies to experience. Track your progress, rate
            what you&apos;ve seen and heard, and explore fun stats about your
            cultural journey.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <SignInButton />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-2xl mx-auto">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">1001</div>
            <p className="text-sm text-muted-foreground">
              Essential albums to discover
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">1001</div>
            <p className="text-sm text-muted-foreground">
              Must-see movies to watch
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">2002</div>
            <p className="text-sm text-muted-foreground">
              Total cultural experiences
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
