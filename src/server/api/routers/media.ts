import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { media } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type SignedURLResponse =
  | { failure?: undefined; success: { url: string; id: number } }
  | { failure: string; success?: undefined };

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const maxFileSize = 1024 * 1024 * 20; // 20 MB
const acceptedTypes = [
  "video/mp4",
  "video/mov",
  "image/jpg",
  "image/jpeg",
  "image/png",
];

const s3Client = new S3Client({
  region: env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export const mediaRouter = createTRPCRouter({
  createMedia: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { url } = input;
      await ctx.db
        .insert(media)
        .values({
          url,
          userId: ctx.session.user.id,
        })
        .returning();
    }),

  deleteMedia: protectedProcedure
    .input(z.object({ mediaId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      if (ctx.session.user.id !== userId) {
        throw new Error("Not authorized to delete this media");
      }
      await ctx.db.delete(media).where(eq(media.id, input.mediaId));
    }),

  getSignedURL: protectedProcedure
    .input(
      z.object({
        fileType: z.string(),
        folder: z.enum(["original_videos", "thumbnails"]),
        fileSize: z.number(),
        checksum: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<SignedURLResponse> => {
      const { fileType, folder, fileSize, checksum } = input;

      const userId = ctx.session.user?.id;
      if (!userId) {
        return { failure: "Not authenticated" };
      }

      if (!acceptedTypes.includes(fileType)) {
        return { failure: "Invalid file type" };
      }

      if (fileSize > maxFileSize) {
        return { failure: "File too large" };
      }

      const fileName = generateFileName();

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        ContentType: fileType,
        ContentLength: fileSize,
        ChecksumSHA256: checksum,
        Metadata: {
          userId,
        },
      });

      const signedURL = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 60,
      });

      const mediaResult = await ctx.db
        .insert(media)
        .values({
          url: signedURL.split("?")[0]!,
          userId,
        })
        .returning();

      return { success: { url: signedURL, id: mediaResult[0]!.id } };
    }),
});
