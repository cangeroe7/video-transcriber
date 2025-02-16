import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { folderRouter } from "~/server/api/routers/folder";
import { videoRouter } from "~/server/api/routers/video";
import { mediaRouter } from "~/server/api/routers/media";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  folder: folderRouter,
  video: videoRouter,
  media: mediaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
