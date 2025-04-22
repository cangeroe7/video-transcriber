ALTER TABLE "video-transcriber_video" RENAME TO "video-transcriber_videos";--> statement-breakpoint
ALTER TABLE "video-transcriber_folders_to_videos" DROP CONSTRAINT "video-transcriber_folders_to_videos_video_id_video-transcriber_video_id_fk";
--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" DROP CONSTRAINT "video-transcriber_video_user_id_video-transcriber_user_id_fk";
--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" DROP CONSTRAINT "video-transcriber_video_original_video_media_id_video-transcriber_media_id_fk";
--> statement-breakpoint
ALTER TABLE "video-transcriber_videos" DROP CONSTRAINT "video-transcriber_video_thumbnail_media_id_video-transcriber_media_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_folders_to_videos" ADD CONSTRAINT "video-transcriber_folders_to_videos_video_id_video-transcriber_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video-transcriber_videos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_videos" ADD CONSTRAINT "video-transcriber_videos_user_id_video-transcriber_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."video-transcriber_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_videos" ADD CONSTRAINT "video-transcriber_videos_original_video_media_id_video-transcriber_media_id_fk" FOREIGN KEY ("original_video_media_id") REFERENCES "public"."video-transcriber_media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_videos" ADD CONSTRAINT "video-transcriber_videos_thumbnail_media_id_video-transcriber_media_id_fk" FOREIGN KEY ("thumbnail_media_id") REFERENCES "public"."video-transcriber_media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
