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

const u = new URL(url.replace(/^postgres:/, "postgresql:"));
console.log("Connected to:", u.hostname, "/", u.pathname.replace(/^\//, ""));

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const tables = await client.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('studio_weekly_hours', 'schedule', 'bookings')
  ORDER BY 1
`);
console.log("Expected tables:", tables.rows.map((r) => r.table_name).join(", ") || "(missing)");

const mig = await client.query(`
  SELECT id, hash, created_at
  FROM drizzle.__drizzle_migrations
  ORDER BY created_at
`);
console.log("Applied migrations:", mig.rowCount);
const fileByHash = new Map();
const { createHash } = await import("crypto");
const { readFileSync, readdirSync } = await import("fs");
for (const name of readdirSync(resolve(process.cwd(), "drizzle")).filter((f) =>
  f.endsWith(".sql")
)) {
  const content = readFileSync(resolve(process.cwd(), "drizzle", name), "utf8");
  fileByHash.set(createHash("sha256").update(content).digest("hex"), name);
}
const appliedSet = new Set(mig.rows.map((r) => r.hash));
for (const r of mig.rows) {
  const tag = fileByHash.get(r.hash) ?? "?";
  console.log(" -", tag, r.hash.slice(0, 12) + "...");
}
const journal = (await import("drizzle-orm/migrator")).readMigrationFiles({
  migrationsFolder: resolve(process.cwd(), "drizzle"),
});
const pending = journal.filter((m) => !appliedSet.has(m.hash));
if (pending.length) {
  console.log("PENDING:", pending.map((m) => fileByHash.get(m.hash)).join(", "));
} else {
  console.log("Pending migrations: none");
}

const scheduleCols = await client.query(`
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'schedule' ORDER BY ordinal_position
`);
console.log("schedule columns:", scheduleCols.rows.map((r) => r.column_name).join(", "));

const bookingCols = await client.query(`
  SELECT column_name FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'bookings' ORDER BY ordinal_position
`);
const bookingColNames = bookingCols.rows.map((r) => r.column_name);
console.log(
  "bookings.reference_image_urls:",
  bookingColNames.includes("reference_image_urls") ? "yes" : "MISSING"
);

const allTables = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY 1
`);
console.log("All public tables:", allTables.rows.map((r) => r.table_name).join(", "));

await client.end();
