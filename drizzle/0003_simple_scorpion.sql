ALTER TABLE "video-transcriber_videos" ADD COLUMN "original_video_media_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_videos" ADD CONSTRAINT "video-transcriber_videos_original_video_media_id_video-transcriber_media_id_fk" FOREIGN KEY ("original_video_media_id") REFERENCES "public"."video-transcriber_media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
