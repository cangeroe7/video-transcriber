import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function About() {
  const session = await auth();

  return (
    <HydrateClient>
      <div>About</div>
    </HydrateClient>
  );
}
