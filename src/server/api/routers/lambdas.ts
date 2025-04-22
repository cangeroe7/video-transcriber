import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { and, eq } from "drizzle-orm";
import { videos } from "~/server/db/schema";
import { api } from "~/trpc/server";

const baseURL =
	"https://video-transcriber-tom-local.s3.us-east-2.amazonaws.com/transcriptions/";

export const lambdaRouter = createTRPCRouter({
	transcribe: protectedProcedure
		.input(
			z.object({
				key: z.string(),
				videoId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const key = input.key;
			const lambdaApiUrl =
				"https://apwhyuni65.execute-api.us-east-2.amazonaws.com/Prod/transcribe";

			const response = await fetch(lambdaApiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Lambda error: ${errorText}`);
			}

			const setTranscriptionResult =
				await api.video.updateTranscriptionUrl({
					videoId: input.videoId,
					transcriptionUrl: baseURL + key,
				});
		}),
});
