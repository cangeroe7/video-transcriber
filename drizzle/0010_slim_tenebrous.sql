ALTER TABLE "video-transcriber_videos" ADD COLUMN "folder_id" varchar(32);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_videos" ADD CONSTRAINT "video-transcriber_videos_folder_id_video-transcriber_folder_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."video-transcriber_folder"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
