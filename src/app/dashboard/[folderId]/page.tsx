import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import VideoLayout from "../../_components/VideoLayout";

export default async function FolderPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { items: videoItems } = await api.video.getUserVideos({
    limit: 10,
    orderBy: { field: "updatedAt", direction: "desc" },
  });

  return (
    <VideoLayout videos={videoItems} />
  );
}
