import type { videos, folders } from "./server/db/schema";
import { z } from "zod";

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

export const VIDEO_WIDTH = 2560;
export const VIDEO_HEIGHT = 1440;
export const VIDEO_FPS = 60;
export const DURATION_IN_FRAMES = 800;

// MY CONSTANTS

export const SubVidProps = z.object({
	subtitles: z
		.array(
			z.object({
				id: z.number().nonnegative(),
				seek: z.number(),
				start: z.number().nonnegative(),
				end: z.number().nonnegative(),
				text: z.string(),
				tokens: z.array(z.number()),
				temperature: z.number(),
				avg_logprob: z.number(),
				compression_ratio: z.number(),
				no_speech_prob: z.number(),
				words: z.array(z.string()).optional(),
			}),
		)
		.nullable(),
	video: z.string().nullable(),
});

export type SubVidProps = z.infer<typeof SubVidProps>;
export type Subtitles = SubVidProps["subtitles"];
export type Subtitle = NonNullable<SubVidProps["subtitles"]>[number];
