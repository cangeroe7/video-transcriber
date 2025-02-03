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
      await ctx.db.insert(folders).values({
        title: input.title,
        userId: ctx.session.user.id,
      });
    }),

  deleteFolder: protectedProcedure
    .input(z.object({ folderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(folders).where(eq(folders.id, input.folderId));
    }),

  getFolderById: protectedProcedure
    .input(z.object({ folderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { folderId } = input;
      const folder = await ctx.db.query.folders.findFirst({
        where: eq(folders.id, folderId),
      });
      return folder ?? null;
    }),
  
  getUserFolders: protectedProcedure.query(async ({ ctx }) => {
    const user_folders = await ctx.db.query.folders.findMany({
      where: eq(folders.userId, ctx.session.user.id),
      orderBy: (folders, { desc }) => [desc(folders.createdAt)],
    });
    return user_folders ?? null;
    }),

  addVideoToFolder: protectedProcedure
    .input(z.object({ folderId: z.number(), videoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(foldersToVideos).values({
        folderId: input.folderId,
        videoId: input.videoId,
      });
    }),

  removeVideoFromFolder: protectedProcedure
    .input(z.object({ folderId: z.number(), videoId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(foldersToVideos).where(eq(foldersToVideos.folderId, input.folderId));
    }),
}); 