import { auth } from "~/server/auth";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    return <div>Sign in to see your dashboard</div>;
  }
  return <div>Dashboard</div>;
}