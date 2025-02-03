import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return <div>Dashboard</div>;
}