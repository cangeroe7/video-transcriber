import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { videos, foldersToVideos, folders } from "~/server/db/schema";
import { and, eq, count } from "drizzle-orm";

export const videoRouter = createTRPCRouter({

  createVideo: protectedProcedure
    .input(z.object({ title: z.string().min(1), originalMediaVideoId: z.number(), thumbnailMediaId: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { title, originalMediaVideoId, thumbnailMediaId } = input;
      await ctx.db.insert(videos).values({ title, originalMediaVideoId, thumbnailMediaId, userId: ctx.session.user.id });
    }),

  deleteVideo: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(videos).where(eq(videos.id, input.videoId));
    }),
    
  updateVideoTitle: protectedProcedure
    .input(z.object({ videoId: z.string(), title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { videoId, title } = input;
      await ctx.db
        .update(videos)
        .set({ title })
        .where(
          and(eq(videos.id, videoId), eq(videos.userId, ctx.session.user.id)));
    }),

  getVideoById: protectedProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { videoId } = input;
      const video = await ctx.db.query.videos.findFirst({
        where: eq(videos.id, videoId),
      });
      return video ?? null;
    }),

  getVideosInFolder: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { folderId } = input;
      
      const folder = await ctx.db.query.folders.findFirst({
        where: eq(folders.id, folderId),
      });
      
      // TODO: Error handling with trpc errors, or failure/success
      if (!folder) {
        throw new Error("Folder not found");
      }
      
      if (folder.userId !== ctx.session.user.id) {
        throw new Error("Not authorized to access folder");
      }

      const folderVideos = await ctx.db.query.foldersToVideos.findMany({
        where: eq(foldersToVideos.folderId, folderId),
        with: {
          video: {
            with: {
              thumbnailMedia: {
                columns: {
                  url: true,
                },
              },
            }
          },
        },
      });

      const videos = folderVideos.map((relation) => relation.video);

      return videos
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
    .query(async ({ ctx, input })  => {
      const { limit, cursor, orderBy } = input;
      const offset = cursor * limit;
      
      const userId = ctx.session.user.id;

      const user_videos = await ctx.db.query.videos.findMany({
        where: eq(videos.userId, userId),
        orderBy: (videos, { [orderBy.direction]: order }) => [order(videos[orderBy.field])],
        limit: limit + 1,
        offset,
        with: {
          thumbnailMedia: {
            columns: {
              url: true
            }
          }
        }
      });

      let nextPage: number | undefined;
      if (user_videos.length > limit) {
        user_videos.pop();
        nextPage = cursor + 1;
      }

      return {
        videos: user_videos,
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
      videoId: z.string(),
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
