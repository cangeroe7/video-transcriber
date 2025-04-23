"use server";

import { VideoSubtitlePreviewer } from "~/components/video-subtitle-previewer";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function VideoProjectPage({
    params,
}: {
    params: { projectId: string };
}) {
    const param = await params
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
        <main className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Video Subtitle Previewer</h1>

            <Suspense fallback={<div>Loading Video Transcription</div>}>
                <VideoSubtitlePreviewer video={video ?? null} />
            </Suspense>
        </main>
    );
}
