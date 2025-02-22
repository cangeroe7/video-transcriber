import { z } from "zod";
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { folders, foldersToVideos } from "~/server/db/schema";

export const folderRouter = createTRPCRouter({

  createFolder: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [folder] = await ctx.db
        .insert(folders)
        .values({
          title: input.title,
          userId: ctx.session.user.id,
        })
        .returning();

      return folder;
    }),

  deleteFolder: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(folders).where(eq(folders.id, input.folderId));
    }),

  getFolderById: protectedProcedure
    .input(z.object({ folderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { folderId } = input;
      const folder = await ctx.db.query.folders.findFirst({
        where: eq(folders.id, folderId),
      });
      return folder ?? null;
    }),
  
  getUserFolders: protectedProcedure
    .input(
      z.object({
        cursor: z.number().min(0).default(0),
        orderBy: z.object({
          field: z.enum(['updatedAt', 'title']),
          direction: z.enum(['asc', 'desc']).default('desc'),
        }).default({ field: 'updatedAt', direction: 'desc' }),
      })
    )
    .query(async ({ ctx, input}) => {
      const { orderBy } = input;
      
      const userId = ctx.session.user.id;

      const user_folders = await ctx.db.query.folders.findMany({
        where: eq(folders.userId, userId),
        orderBy: (folders, { [orderBy.direction]: order }) => [order(folders[orderBy.field])],
        with: {
          thumbnailMedia: {
            columns: {
              url: true
            }
          }
        } 
      });
      
      return {
        folders: user_folders,
      }
    }),

  addVideosToFolder: protectedProcedure
    .input(z.object({ 
      folderId: z.string(), 
      videoIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { folderId, videoIds } = input;

      await ctx.db.insert(foldersToVideos).values(
        videoIds.map((videoId) => ({
          folderId,
          videoId,
        }))
      )
    }),

  removeVideoFromFolder: protectedProcedure
    .input(z.object({ folderId: z.string(), videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(foldersToVideos).where(eq(foldersToVideos.folderId, input.folderId));
    }),
}); 