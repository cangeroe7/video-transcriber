"use client";

import { api } from "~/trpc/react";

export function Videos() {
  const [userVideos] = api.video.getUserVideos.useSuspenseQuery({
    limit: 10,
    cursor: 0,
    orderBy: {
      field: "updatedAt",
      direction: "desc",
    },
  });

  return (
    <div className="w-full max-w-xs">
      {userVideos ? (
        <div>
          <p className="truncate">Your most recent post: {userVideos.items.length}</p>
          <ul className="mt-2 list-disc list-inside">
            {userVideos.items.map((video) => (
              <li key={video.id} className="text-gray-600">
                <a href={video.originalVideoUrl} target="_blank" rel="noopener noreferrer">
                  {video.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}