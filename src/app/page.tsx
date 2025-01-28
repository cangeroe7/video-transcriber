import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import ProfileButton from "~/app/_components/ProfileButton";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen justify-center bg-gray-800 text-white">
        {session?.user ? <LatestPost /> : <div>Sign in to see your posts</div>}
        {session?.user && <ProfileButton user={session.user} image={session.user.image ?? "/favicon.ico"} />}
      </main>
    </HydrateClient>
  );
}
