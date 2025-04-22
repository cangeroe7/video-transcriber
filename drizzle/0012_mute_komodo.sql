ALTER TABLE "video-transcriber_media" DROP CONSTRAINT "video-transcriber_media_user_id_video-transcriber_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "video-transcriber_media" ADD CONSTRAINT "video-transcriber_media_user_id_video-transcriber_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."video-transcriber_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
