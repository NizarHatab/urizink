CREATE TABLE IF NOT EXISTS "portfolio_categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" varchar(80) NOT NULL,
  "slug" varchar(80) NOT NULL,
  "sort_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "portfolio_categories_name_unique" UNIQUE("name"),
  CONSTRAINT "portfolio_categories_slug_unique" UNIQUE("slug")
);

INSERT INTO "portfolio_categories" ("name", "slug", "sort_order")
VALUES
  ('Black Work', 'black-work', 1),
  ('Fine Line', 'fine-line', 2),
  ('Anime', 'anime', 3),
  ('Black & Grey', 'black-grey', 4),
  ('Abstract', 'abstract', 5),
  ('Dark Art', 'dark-art', 6)
ON CONFLICT ("name") DO NOTHING;

ALTER TABLE "portfolio" ADD COLUMN IF NOT EXISTS "category_id" uuid;

DO $$ BEGIN
  ALTER TABLE "portfolio"
    ADD CONSTRAINT "portfolio_category_id_portfolio_categories_id_fk"
    FOREIGN KEY ("category_id") REFERENCES "portfolio_categories"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
