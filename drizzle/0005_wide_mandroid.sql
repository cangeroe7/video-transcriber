ALTER TABLE "video-transcriber_folders_to_videos" ALTER COLUMN "folder_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "video-transcriber_folders_to_videos" ALTER COLUMN "video_id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" ALTER COLUMN "id" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" ALTER COLUMN "id" DROP IDENTITY;