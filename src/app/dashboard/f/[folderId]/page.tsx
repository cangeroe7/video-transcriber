import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import VideoLayout from "~/app/_components/VideoLayout";

import { getSignedURL } from "../actions";


interface FolderPageProps {
  params: { folderId: string };
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderId } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  console.log(folderId);

  const { items: videoItems } = await api.video.getUserVideos({
    limit: 10,
    orderBy: { field: "updatedAt", direction: "desc" },
  });

  return (
    <VideoLayout videos={videoItems} />
  );
}
