import type { videos, folders } from "./server/db/schema";

import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
export type VideoByIdOutput = RouterOutput["video"]["getVideoById"]

export type VideoWithMedia = typeof videos.$inferSelect & {
  videoMedia: {
    url: string;
  } | null;
};


export type FolderWithMedia = typeof folders.$inferSelect & {
  thumbnailMedia: {
    url: string;
  } | null;
};
