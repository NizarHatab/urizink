-- Additive only: no deletes, no drops of existing data.

ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "featured_on_home" boolean DEFAULT false NOT NULL;
ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "home_sort_order" integer DEFAULT 0 NOT NULL;

CREATE TABLE IF NOT EXISTS "studio_home_content" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "singleton_key" varchar(32) NOT NULL,
  "bio_heading" varchar(200),
  "bio_body" text,
  "bio_published" boolean DEFAULT false NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "studio_home_content_singleton_key_unique" UNIQUE("singleton_key")
);

INSERT INTO "studio_home_content" ("singleton_key", "bio_heading", "bio_body", "bio_published")
VALUES ('main', 'Meet Uriz', '', false)
ON CONFLICT ("singleton_key") DO NOTHING;
