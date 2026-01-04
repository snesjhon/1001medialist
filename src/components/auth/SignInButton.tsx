"use client";

import { signInWithGoogle } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  return (
    <form action={signInWithGoogle}>
      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Sign in with Google
      </Button>
    </form>
  );
}
