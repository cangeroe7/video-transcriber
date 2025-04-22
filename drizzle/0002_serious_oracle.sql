ALTER TABLE "video-transcriber_videos" DROP CONSTRAINT "video-transcriber_videos_original_video_media_id_video-transcriber_media_id_fk";
--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" DROP COLUMN IF EXISTS "original_video_media_id";