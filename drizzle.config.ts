import { config as loadEnv } from "dotenv";
import { resolve } from "path";
import type { Config } from "drizzle-kit";

// Load .env then .env.local so `npx drizzle-kit migrate` picks up POSTGRES_URL
loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), ".env.local") });

export default {
  schema: "./src/db/schema/**/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
} satisfies Config;
