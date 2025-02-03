
import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { signOut } from "next-auth/react";

export default async function Profile() {
  const session = await auth();
  if (!session?.user) {
    return <div>Sign in to see your profile</div>;
  }
  return (
    <HydrateClient>
      <div>Profile</div>

      <div className="flex justify-center mt-4">
        <button onClick={() => signOut()}>Sign Out</button>
      </div>


    </HydrateClient>
  );
}
