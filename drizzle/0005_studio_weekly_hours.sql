CREATE TABLE IF NOT EXISTS "studio_weekly_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"day_of_week" smallint NOT NULL,
	"start_time" varchar(8) NOT NULL,
	"end_time" varchar(8) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "studio_weekly_hours_day_idx" ON "studio_weekly_hours" USING btree ("day_of_week");
