import { videos } from "~/server/db/schema";
import { VideoItem } from "./VideoItem";

export default function VideoLayout(props: {
  videos: (typeof videos.$inferSelect)[];
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {props.videos.map((video) => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </div>
  )
}
