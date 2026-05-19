import { createHash } from "crypto";
import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

// Drizzle stores sha256 of migration file contents (same as migrator)
const dir = resolve(process.cwd(), "drizzle");
const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

for (const f of files) {
  const content = readFileSync(resolve(dir, f), "utf8");
  const hash = createHash("sha256").update(content).digest("hex");
  console.log(f, hash);
}
