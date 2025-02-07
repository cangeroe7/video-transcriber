import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { VideoItem } from "~/app/dashboard/f/[folderId]/VideoItem"; // Importing VideoItem

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="p-4">
      <h1 className="mb-4 text-white">Dashboard</h1>
    </div>
  );
}