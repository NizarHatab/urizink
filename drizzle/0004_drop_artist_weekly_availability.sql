-- Remove weekly-hours table (scheduling will be replaced later).
-- CASCADE drops FKs and indexes. Must run before dropping "artists" in 0003.
DROP TABLE IF EXISTS "artist_weekly_availability" CASCADE;
