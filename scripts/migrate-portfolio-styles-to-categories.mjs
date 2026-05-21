/**
 * Maps portfolio.style text → portfolio.category_id, then drops the style column.
 * Does not delete portfolio rows or images.
 */
import { config } from "dotenv";
import { resolve } from "path";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL missing");
  process.exit(1);
}

const CANONICAL = [
  "Black Work",
  "Fine Line",
  "Anime",
  "Black & Grey",
  "Abstract",
  "Dark Art",
];

const ALIASES = {
  blackwork: "Black Work",
  "black work": "Black Work",
  "black-work": "Black Work",
  fineline: "Fine Line",
  "fine line": "Fine Line",
  "fine-line": "Fine Line",
  "fine  line": "Fine Line",
  anime: "Anime",
  "black & grey": "Black & Grey",
  "black and grey": "Black & Grey",
  "black & gray": "Black & Grey",
  "black and gray": "Black & Grey",
  "black & grey realism": "Black & Grey",
  realism: "Black & Grey",
  abstrat: "Abstract",
  abstract: "Abstract",
  geometric: "Abstract",
  "dark art": "Dark Art",
  darkart: "Dark Art",
  traditional: "Dark Art",
  minimal: "Fine Line",
};

function normalizeKey(raw) {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveCategoryName(style) {
  if (!style?.trim()) return null;
  const key = normalizeKey(style);
  for (const c of CANONICAL) {
    if (c.toLowerCase() === key) return c;
  }
  return ALIASES[key] ?? style.trim();
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const colCheck = await client.query(`
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'portfolio' AND column_name = 'style'
`);
if (colCheck.rowCount === 0) {
  console.log("Column portfolio.style already removed — nothing to migrate.");
  await client.end();
  process.exit(0);
}

const catTable = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'portfolio_categories'
`);
if (catTable.rowCount === 0) {
  console.error("Run migration 0010_portfolio_categories first (npm run db:migrate).");
  await client.end();
  process.exit(1);
}

const { rows: categories } = await client.query(
  `SELECT id, name FROM portfolio_categories`,
);
const byName = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));

async function ensureCategory(name) {
  const key = name.toLowerCase();
  if (byName.has(key)) return byName.get(key);

  const slug = slugify(name);
  let inserted = await client.query(
    `INSERT INTO portfolio_categories (name, slug, sort_order)
     VALUES ($1, $2, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM portfolio_categories))
     ON CONFLICT (name) DO NOTHING
     RETURNING id`,
    [name, slug],
  );
  let id = inserted.rows[0]?.id;
  if (!id) {
    const existing = await client.query(
      `SELECT id FROM portfolio_categories WHERE lower(name) = lower($1)`,
      [name],
    );
    id = existing.rows[0]?.id;
  }
  if (!id) throw new Error(`Could not resolve category: ${name}`);
  byName.set(key, id);
  if (inserted.rows[0]) console.log(`  + category: ${name}`);
  return id;
}

const { rows: pieces } = await client.query(
  `SELECT id, style, category_id FROM portfolio WHERE style IS NOT NULL AND trim(style) <> ''`,
);

let updated = 0;
let skipped = 0;
let already = 0;

for (const p of pieces) {
  const catName = resolveCategoryName(p.style);
  if (!catName) {
    skipped++;
    continue;
  }
  const categoryId = await ensureCategory(catName);
  if (p.category_id === categoryId) {
    already++;
    continue;
  }
  await client.query(`UPDATE portfolio SET category_id = $1 WHERE id = $2`, [
    categoryId,
    p.id,
  ]);
  updated++;
}

console.log("\nMigration summary:");
console.log(`  Pieces with style text: ${pieces.length}`);
console.log(`  Updated category_id:    ${updated}`);
console.log(`  Already linked:         ${already}`);
console.log(`  Skipped (empty):        ${skipped}`);
const stillStyled = await client.query(
  `SELECT count(*)::int AS c FROM portfolio WHERE style IS NOT NULL AND trim(style) <> '' AND category_id IS NULL`,
);
const unmapped = stillStyled.rows[0]?.c ?? 0;
if (unmapped > 0) {
  console.warn(`  Warning: ${unmapped} piece(s) still have style text but no category_id.`);
}

console.log("\nDropping portfolio.style column…");
await client.query(`ALTER TABLE portfolio DROP COLUMN IF EXISTS style`);
console.log("Done. portfolio.style removed; images and rows unchanged.");

await client.end();
