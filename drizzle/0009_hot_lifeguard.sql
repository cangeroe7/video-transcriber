ALTER TABLE "video-transcriber_folder" ADD COLUMN "thumbnail_media_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_folder" ADD CONSTRAINT "video-transcriber_folder_thumbnail_media_id_video-transcriber_media_id_fk" FOREIGN KEY ("thumbnail_media_id") REFERENCES "public"."video-transcriber_media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
