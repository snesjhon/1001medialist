import Link from "next/link";
import { getUser } from "@/app/actions/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";

export async function Navbar() {
  const user = await getUser();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto py-8">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">1001 Media</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/list"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                List
              </Link>
              <Link
                href="/stats"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                Stats
              </Link>
              <Link
                href="/history"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                History
              </Link>
              <SignOutButton />
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
