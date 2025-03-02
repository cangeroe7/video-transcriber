import { VideoSubtitlePreviewer } from "~/components/video-subtitle-previewer";

export default async function VideoProjectPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Video Subtitle Previewer</h1>

      <VideoSubtitlePreviewer />
    </main>
  );
}
