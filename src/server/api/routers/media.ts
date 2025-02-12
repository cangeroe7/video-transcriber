import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { mediaType, media } from "~/server/db/schema";
import { eq, count } from "drizzle-orm";

export const mediaRouter = createTRPCRouter({
  createMedia: protectedProcedure
    .input(z.object({ }))
})