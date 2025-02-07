import { auth } from "~/server/auth";
import ProfileButton from "~/app/_components/ProfileButton";
import Link from "next/link";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="flex min-h-screen justify-center bg-gray-800 text-white">
        {session?.user ? (
          <div className="absolute top-0 right-0 m-16 flex items-center">
            <Link href="/dashboard" className="mr-4">
              Dashboard
            </Link>
            <ProfileButton user={session.user} image={session.user.image ?? "/favicon.ico"} />
          </div>
        ) : (
          <div className="absolute top-0 right-0 m-16">
            <Link href="/sign-in" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        )}
      </main>
    </HydrateClient>
  );
}
