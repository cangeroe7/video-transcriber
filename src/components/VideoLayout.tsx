import { VideoItem } from "./VideoItem";
import Link from "next/link";
import type { VideoWithMedia } from "~/types";

export default function VideoLayout(props: { videos: VideoWithMedia[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {props.videos.map((video) => (
        <Link draggable={false} key={video.id} href={`/v/${video.id}`}>
          <VideoItem video={video} />
        </Link>
      ))}
    </div>
  );
}
