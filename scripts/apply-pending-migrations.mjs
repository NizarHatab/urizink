/**
 * Applies journal migrations missing from drizzle.__drizzle_migrations.
 * Use when `npm run db:migrate` reports success but a migration did not run.
 */
import { config } from "dotenv";
import { createHash } from "crypto";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";
import pg from "pg";
import { readMigrationFiles } from "drizzle-orm/migrator";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.POSTGRES_URL;
if (!url) {
  console.error("POSTGRES_URL missing");
  process.exit(1);
}

const dir = resolve(process.cwd(), "drizzle");
const fileByHash = new Map();
for (const name of readdirSync(dir).filter((f) => f.endsWith(".sql"))) {
  const content = readFileSync(resolve(dir, name), "utf8");
  fileByHash.set(createHash("sha256").update(content).digest("hex"), name);
}

const journal = readMigrationFiles({ migrationsFolder: dir });
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const applied = await client.query(`SELECT hash FROM drizzle.__drizzle_migrations`);
const appliedSet = new Set(applied.rows.map((r) => r.hash));
const pending = journal.filter((m) => !appliedSet.has(m.hash));

if (pending.length === 0) {
  console.log("No pending migrations.");
  await client.end();
  process.exit(0);
}

for (const migration of pending) {
  const fileName = fileByHash.get(migration.hash);
  if (!fileName) {
    console.error("No SQL file for hash", migration.hash);
    await client.end();
    process.exit(1);
  }
  console.log(`Applying ${fileName}...`);
  await client.query("BEGIN");
  try {
    for (const stmt of migration.sql.map((s) => s.trim()).filter(Boolean)) {
      await client.query(stmt);
    }
    await client.query(
      `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
      [migration.hash, Date.now()]
    );
    await client.query("COMMIT");
    console.log(`  OK`);
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(`  Failed:`, e.message);
    await client.end();
    process.exit(1);
  }
}

await client.end();
console.log("All pending migrations applied.");
