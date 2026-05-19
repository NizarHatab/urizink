-- Single studio (Uriz): remove artists table and all artist_id columns.
-- Run this in Neon (SQL Editor) or psql against your production database.
-- Weekly-hours table: use 0004_drop_artist_weekly_availability.sql (drops it entirely).

-- 1) Portfolio
ALTER TABLE "portfolio" DROP CONSTRAINT IF EXISTS "portfolio_artist_id_artists_id_fk";
ALTER TABLE "portfolio" DROP COLUMN IF EXISTS "artist_id";

-- 2) Schedule blocks
DROP INDEX IF EXISTS "schedule_artist_time_idx";
ALTER TABLE "schedule" DROP CONSTRAINT IF EXISTS "schedule_artist_id_artists_id_fk";
ALTER TABLE "schedule" DROP COLUMN IF EXISTS "artist_id";
CREATE INDEX IF NOT EXISTS "schedule_start_time_idx" ON "schedule" USING btree ("start_time");

-- 3) Bookings (column had no FK in initial migration)
ALTER TABLE "bookings" DROP COLUMN IF EXISTS "artist_id";

-- 4) Reviews (drop FK if it exists, then column)
ALTER TABLE "reviews" DROP CONSTRAINT IF EXISTS "reviews_artist_id_artists_id_fk";
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "artist_id";
DROP INDEX IF EXISTS "reviews_artist_idx";

-- 5) Artists table
DROP TABLE IF EXISTS "artists";
