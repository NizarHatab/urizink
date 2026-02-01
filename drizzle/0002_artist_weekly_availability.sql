CREATE TABLE "artist_weekly_availability" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_id" uuid NOT NULL,
	"day_of_week" smallint NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artist_weekly_availability" ADD CONSTRAINT "artist_weekly_availability_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "artist_weekly_availability_artist_idx" ON "artist_weekly_availability" USING btree ("artist_id");
--> statement-breakpoint
CREATE INDEX "artist_weekly_availability_artist_day_idx" ON "artist_weekly_availability" USING btree ("artist_id","day_of_week");
