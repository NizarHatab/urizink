ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "reference_image_urls" jsonb DEFAULT '[]'::jsonb NOT NULL;
