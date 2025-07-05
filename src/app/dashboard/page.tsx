import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import VideoLayout from "~/components/VideoLayout";
import type { VideoWithMedia, FolderWithMedia } from "~/types";
import EmptyStateBanner from "~/components/FancyText";

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

	const {
		videos,
	}: { videos: VideoWithMedia[]; nextPage: number | undefined } =
		await api.video.getUserVideos({
			limit: 10,
			orderBy: { field: "updatedAt", direction: "desc" },
		});

	const { folders }: { folders: FolderWithMedia[] } =
		await api.folder.getUserFolders({});

	return (
		<>
			<div className="absolute inset-0 h-[600px] bg-gradient-to-b from-[#DCF8E5]/30 to-transparent"></div>
			<div className="container mx-auto max-w-4xl">
				<div className="mb-10 mt-12">
					<EmptyStateBanner folders={folders} />
				</div>
				<div className="align-center mb-6 flex">
					<h1 className="text-xl font-bold">Recent videos</h1>
				</div>

				<VideoLayout videos={videos} />
			</div>
		</>
	);
}
