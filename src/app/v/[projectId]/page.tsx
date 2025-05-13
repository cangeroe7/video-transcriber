"use server";

import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { VideoEditor } from "./VideoEditor";

export default async function VideoProjectPage({
	params,
}: {
	params: { projectId: string };
}) {
	const param = await params;
	const videoId = param.projectId;
	const video = await api.video.getVideoById({
		videoId,
	});

	if (!video) {
		notFound();
	}

	const key = new URL(video.videoMedia.url).pathname.slice(1); // Remove leading "/"

	if (!video.subtitlesUrl) {
		try {
			await api.lambda.transcribe({ videoId, key });
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<>
			<main className="fixed inset-0 mt-0 flex flex-col pt-16">
				<VideoEditor video={video} />
			</main>
		</>
	);
}
