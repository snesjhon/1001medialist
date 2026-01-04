import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeError() {
  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            There was an error signing you in. This could be due to:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Invalid or expired authentication code</li>
            <li>Network connectivity issues</li>
            <li>Configuration problems</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Please try signing in again.
          </p>
          <Link href="/">
            <Button>Go home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
