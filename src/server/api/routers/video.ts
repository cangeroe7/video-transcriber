import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { videos, folders } from "~/server/db/schema";
import { and, eq, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const videoRouter = createTRPCRouter({
	getTranscriptStatus: protectedProcedure
		.input(z.object({ videoId: z.string() }))
		.query(async ({ ctx, input }) => {
			const video = await ctx.db.query.videos.findFirst({
				where: eq(videos.id, input.videoId),
				with: {
					videoMedia: true,
				},
			});

			return video?.subtitlesUrl
				? { ready: true, video }
				: { ready: false };
		}),
	createVideo: protectedProcedure
		.input(
			z.object({
				title: z.string().min(1),
				originalMediaVideoId: z.number(),
				thumbnailMediaId: z.number().optional(),
                width: z.number().int().default(1440),
                height: z.number().int().default(1080),
                duration: z.number().int().default(10),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { title, originalMediaVideoId, thumbnailMediaId, width, height, duration } = input;
			const inserted = await ctx.db.insert(videos).values({
				title,
				originalMediaVideoId,
				thumbnailMediaId,
				userId: ctx.session.user.id,
                width,
                height,
                duration,
			}).returning({ id: videos.id });
			return { id: inserted[0]?.id };
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
					and(
						eq(videos.id, videoId),
						eq(videos.userId, ctx.session.user.id),
					),
				);
		}),

	updateTranscriptionUrl: protectedProcedure
		.input(
			z.object({
				videoId: z.string(),
				transcriptionUrl: z.string().url(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { videoId, transcriptionUrl } = input;

			try {
				const updated = await ctx.db
					.update(videos)
					.set({ subtitlesUrl: transcriptionUrl })
					.where(
						and(
							eq(videos.id, videoId),
							eq(videos.userId, ctx.session.user.id),
						),
					)
					.returning()
					.then((res) => res[0]);

				if (!updated) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Video not found or access denied.",
					});
				}

				return updated;
			} catch (err) {
				console.error("Failed to update transcription URL:", err);

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message:
						"Something went wrong while updating the transcription URL.",
					cause: err,
				});
			}
		}),

	getVideoById: protectedProcedure
		.input(z.object({ videoId: z.string() }))
		.query(async ({ ctx, input }) => {
			const { videoId } = input;
			const video = await ctx.db.query.videos.findFirst({
				where: eq(videos.id, videoId),
				with: {
					videoMedia: true,
				},
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

			console.log("folder", folder);
			// TODO: Error handling with trpc errors, or failure/success
			if (!folder) {
				throw new Error("Folder not found");
			}

			if (folder.userId !== ctx.session.user.id) {
				throw new Error("Not authorized to access folder");
			}

			const videosInFolder = await ctx.db.query.videos.findMany({
				where: eq(videos.folderId, folderId),
				with: {
					thumbnailMedia: {
						columns: {
							url: true,
						},
					},
				},
			});

			console.log("videos", videos);

			return videosInFolder;
		}),

	getUserVideos: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(10),
				cursor: z.number().min(0).default(0),
				orderBy: z
					.object({
						field: z.enum(["updatedAt", "title"]),
						direction: z.enum(["asc", "desc"]).default("desc"),
					})
					.default({ field: "updatedAt", direction: "desc" }),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { limit, cursor, orderBy } = input;
			const offset = cursor * limit;

			const userId = ctx.session.user.id;

			const user_videos = await ctx.db.query.videos.findMany({
				where: eq(videos.userId, userId),
				orderBy: (videos, { [orderBy.direction]: order }) => [
					order(videos[orderBy.field]),
				],
				limit: limit + 1,
				offset,
				with: {
					videoMedia: {
						columns: {
							url: true,
						},
					},
				},
			});

			let nextPage: number | undefined;
			if (user_videos.length > limit) {
				user_videos.pop();
				nextPage = cursor + 1;
			}

			return {
				videos: user_videos,
				nextPage,
			};
		}),

	totalUserVideos: protectedProcedure.query(async ({ ctx }) => {
		const totalUserVideosResult = await ctx.db
			.select({
				count: count(),
			})
			.from(videos)
			.where(eq(videos.userId, ctx.session.user.id));

		return totalUserVideosResult[0]?.count ?? 0;
	}),

	updateVideoUrl: protectedProcedure
		.input(
			z.object({
				videoId: z.string(),
				urlType: z.enum([
					"originalVideoUrl",
					"subtitlesUrl",
					"processedVideoUrl",
				]),
				newUrl: z.string().url(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { videoId, urlType, newUrl } = input;

			await ctx.db
				.update(videos)
				.set({ [urlType]: newUrl })
				.where(eq(videos.id, videoId));
		}),
});
