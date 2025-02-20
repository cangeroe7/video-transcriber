import type { videos } from "~/server/db/schema";
import { VideoItem } from "./VideoItem";

export default function VideoLayout(props: {
  videos: (typeof videos.$inferSelect)[];
}) {
  return (

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
        {props.videos.map((video) => (
          <>
          <VideoItem key={video.id} video={video} />
          </>
        ))}
      </div>
  )
}
