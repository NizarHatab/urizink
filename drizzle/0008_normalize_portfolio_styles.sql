-- Normalize portfolio.style labels only. No row deletes; image_url and all other columns unchanged.

UPDATE "portfolio" SET "style" = 'Black Work'
WHERE "style" IS NOT NULL
  AND lower(trim(regexp_replace("style", '\s+', ' ', 'g'))) IN ('blackwork', 'black work', 'black-work')
  AND "style" IS DISTINCT FROM 'Black Work';

UPDATE "portfolio" SET "style" = 'Fine Line'
WHERE "style" IS NOT NULL
  AND lower(trim(regexp_replace("style", '\s+', ' ', 'g'))) IN ('fineline', 'fine line', 'fine-line', 'minimal')
  AND "style" IS DISTINCT FROM 'Fine Line';

UPDATE "portfolio" SET "style" = 'Anime'
WHERE "style" IS NOT NULL
  AND lower(trim(regexp_replace("style", '\s+', ' ', 'g'))) = 'anime'
  AND "style" IS DISTINCT FROM 'Anime';

UPDATE "portfolio" SET "style" = 'Black & Grey'
WHERE "style" IS NOT NULL
  AND lower(trim(regexp_replace("style", '\s+', ' ', 'g'))) IN (
    'black & grey', 'black and grey', 'black & gray', 'black and gray',
    'black & grey realism', 'realism'
  )
  AND "style" IS DISTINCT FROM 'Black & Grey';

UPDATE "portfolio" SET "style" = 'Abstract'
WHERE "style" IS NOT NULL
  AND lower(trim(regexp_replace("style", '\s+', ' ', 'g'))) IN ('abstrat', 'abstract', 'geometric')
  AND "style" IS DISTINCT FROM 'Abstract';

UPDATE "portfolio" SET "style" = 'Dark Art'
WHERE "style" IS NOT NULL
  AND lower(trim(regexp_replace("style", '\s+', ' ', 'g'))) IN ('dark art', 'darkart', 'traditional')
  AND "style" IS DISTINCT FROM 'Dark Art';
