import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import VideoLayout from "~/components/VideoLayout";
import type { VideoWithMedia } from "~/types";

interface FolderPageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { folderId } = await params;

  const videosItems: VideoWithMedia[] = await api.video.getVideosInFolder({
    folderId,
  });

  console.log(videosItems);

  return (
    <div className="container mx-auto p-4">
      <div className="align-center mb-4 flex">
        <h1 className="text-2xl font-bold">My Folder</h1>
      </div>
      <VideoLayout videos={videosItems} />
    </div>
  );
}
