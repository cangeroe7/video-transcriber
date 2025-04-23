import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lambdaRouter = createTRPCRouter({
	transcribe: protectedProcedure
		.input(
			z.object({
				key: z.string(),
				videoId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const lambdaApiUrl =
				"https://apwhyuni65.execute-api.us-east-2.amazonaws.com/Prod/transcribe";

			console.log("Calling Lambda API");
            console.log(input);

			const response = await fetch(lambdaApiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error(`Lambda error: ${errorText}`);
				throw new Error(`Lambda error: ${errorText}`);
			}

            console.log({response});
		}),
});
