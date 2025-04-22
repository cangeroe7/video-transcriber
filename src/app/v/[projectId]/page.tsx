"use server"

import { VideoSubtitlePreviewer } from "~/components/video-subtitle-previewer";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";

export default async function VideoProjectPage({ params }: { params: { projectId: string } }) {

    const videoId = params.projectId;
    const video = await api.video.getVideoById({
        videoId
    })

    if (!video) {
        notFound()
    }

    if (!video.processedVideoUrl) {
        const key = `original_videos/${videoId}`
        try {
            const result = await api.lambda.transcribe({ videoId, key })
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Video Subtitle Previewer</h1>

            
            <VideoSubtitlePreviewer video={video ?? null} />
        </main>
    );
}
