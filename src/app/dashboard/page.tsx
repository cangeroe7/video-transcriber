import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import VideoLayout from "~/app/_components/VideoLayout";
import { VideoUpload } from "~/app/dashboard/VideoUpload";
import type { videos } from "~/server/db/schema";

// TODO:
// * Add a newProject button, to upload new video.
// * Add pagination, adjustable page sizes, or infinity scroll with useInfiniteQuery
// * Add different ordering last edited, last opened, size?, alphabetically. desc or asc
// * Add different display options, (gridview, listview)
// * Today, last 7, last 30 days

export type VideoWithMedia = typeof videos.$inferSelect & {
  thumbnailMedia: {
    url: string;
  } | null;
};

export default async function FolderPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { items: videoItems }: { items: VideoWithMedia[] } =
    await api.video.getUserVideos({
      limit: 10,
      orderBy: { field: "updatedAt", direction: "desc" },
    });

  const userFolders = await api.folder.getUserFolders();

  return (
    <div className="container mx-auto p-4">
      <div className="align-center mb-4 flex">
        <h1 className="text-2xl font-bold">My Videos</h1>
        <div className="ml-auto">
          <VideoUpload folders={userFolders} />
        </div>
      </div>

      <VideoLayout videos={videoItems} />
    </div>
  );
}
