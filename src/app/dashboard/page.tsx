import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import VideoLayout from "./[folderId]/VideoLayout";

// TODO:
// * Add a newProject button, to upload new video.
// * Add pagination, adjustable page sizes, or infinity scroll with useInfiniteQuery
// * Add different ordering last edited, last opened, size?, alphabetically. desc or asc
// * Add different display options, (gridview, listview)
// * Today, last 7, last 30 days


export default async function FolderPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { items: videoItems } = await api.video.getUserVideos({
    limit: 10,
    orderBy: { field: "updatedAt", direction: "desc" },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className=" text-2xl font-bold mb-4">My Videos</h1>
      <VideoLayout videos={videoItems} />
    </div>
  );
}

