import type { videos, folders } from "./server/db/schema";

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
