import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { videos, foldersToVideos } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";

export const videoRouter = createTRPCRouter({

  createVideo: protectedProcedure
    .input(z.object({ title: z.string().min(1), originalVideoMediaId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { title, originalVideoMediaId } = input;
      await ctx.db.insert(videos).values({ title, originalVideoMediaId, userId: ctx.session.user.id });
    }),

  deleteVideo: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(videos).where(eq(videos.id, input.videoId));
    }),

  getVideoById: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { videoId } = input;
      const video = await ctx.db.query.videos.findFirst({
        where: eq(videos.id, videoId),
      });
      return video ?? null;
    }),

  getVideosInFolder: protectedProcedure
    .input(z.object({ folderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { folderId } = input;

      const folderVideos = await ctx.db.query.foldersToVideos.findMany({
        where: eq(foldersToVideos.folderId, folderId),
        with: {
          video: true,
        },
      });

      const videos = folderVideos.map((relation) => relation.video);

      return videos.length > 0 ? videos : null;
    }),

  getUserVideos: protectedProcedure
    .input(
      z.object({ 
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().min(0).default(0),
        orderBy: z.object({
          field: z.enum(['updatedAt', 'title']),
          direction: z.enum(['asc', 'desc']).default('desc'),
        }).default({ field: 'updatedAt', direction: 'desc' }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, orderBy } = input;
      const offset = cursor * limit;

      const user_videos = await ctx.db.query.videos.findMany({
        where: eq(videos.userId, ctx.session.user.id),
        orderBy: (videos, { [orderBy.direction]: order }) => [order(videos[orderBy.field])],
        limit: limit + 1,
        offset,
      });

      let nextPage: number | undefined;
      if (user_videos.length > limit) {
        user_videos.pop();
        nextPage = cursor + 1;
      }

      return {
        items: user_videos,
        nextPage,
      }
    }),

  totalUserVideos: protectedProcedure.query(async ({ ctx }) => {
    const totalUserVideosResult = await ctx.db.select({ 
        count: count() 
      })
      .from(videos)
      .where(eq(videos.userId, ctx.session.user.id));

      return totalUserVideosResult[0]?.count ?? 0;
    }),

  updateVideoUrl: protectedProcedure
    .input(z.object({
      videoId: z.number(),
      urlType: z.enum(['originalVideoUrl', 'subtitlesUrl', 'processedVideoUrl']),
      newUrl: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { videoId, urlType, newUrl } = input;

      await ctx.db.update(videos)
        .set({ [urlType]: newUrl })
        .where(eq(videos.id, videoId));
    }),

})