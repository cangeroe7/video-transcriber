
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Link from "next/link";

export default async function Profile() {
  const session = await auth();
  if (!session?.user) {
    return <div>Sign in to see your profile</div>;
  }
  return (
    <HydrateClient>
      <div>Profile</div>

      <div className="flex justify-center mt-4">
        <Link 
          href="/api/auth/signout"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        >
          Sign Out
        </Link>
      </div>


    </HydrateClient>
  );
}
