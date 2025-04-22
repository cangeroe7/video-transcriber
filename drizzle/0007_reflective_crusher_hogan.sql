ALTER TABLE "video-transcriber_folders_to_videos" DROP CONSTRAINT "video-transcriber_folders_to_videos_folder_id_video-transcriber_folder_f_id_fk";
--> statement-breakpoint
ALTER TABLE "video-transcriber_folders_to_videos" DROP CONSTRAINT "video-transcriber_folders_to_videos_video_id_video-transcriber_videos_v_id_fk";
--> statement-breakpoint

ALTER TABLE "video-transcriber_folder" ADD COLUMN "id" varchar(255) PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" ADD COLUMN "id" varchar(32) PRIMARY KEY NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_folders_to_videos" ADD CONSTRAINT "video-transcriber_folders_to_videos_folder_id_video-transcriber_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."video-transcriber_folder"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_folders_to_videos" ADD CONSTRAINT "video-transcriber_folders_to_videos_video_id_video-transcriber_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video-transcriber_videos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "video-transcriber_folder" DROP COLUMN IF EXISTS "f_id";--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" DROP COLUMN IF EXISTS "v_id";