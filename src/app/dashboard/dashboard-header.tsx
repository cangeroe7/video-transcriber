import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import ProfileButton from "~/app/_components/ProfileButton";
import { auth } from "~/server/auth";
import { Button } from "../_components/ui/button";

export async function DashboardHeader() {
  const session = await auth();

  return (
    <header className="fixed left-0 right-0 top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      <Link href="/dashboard" className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6" />
        <span className="text-xl font-semibold">Dashboard</span>
      </Link>
      {session ? (
        <ProfileButton
          user={session.user}
          image={session.user.image ?? "/favicon.ico"}
        />
      ) : (
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      )}
    </header>
  );
}
