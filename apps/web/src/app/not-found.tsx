import Link from "next/link";
import { Icons } from "@repo/ui/icons";
import { Button } from "@repo/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
      <Icons.HelpCircle className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-5xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        Sorry, the page you are looking for could not be found.
      </p>
      <Button asChild className="mt-4">
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}