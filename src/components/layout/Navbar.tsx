import Link from "next/link";
import { getUser } from "@/app/actions/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="border-b bg-background">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className="text-lg font-bold">1001 Media</span>
          </Link>

          {user && (
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/list"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                List
              </Link>
              <Link
                href="/stats"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Stats
              </Link>
              <Link
                href="/history"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                History
              </Link>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
