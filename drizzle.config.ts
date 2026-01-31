// drizzle.config.ts or drizzle.config.mts
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema/**/*",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.POSTGRES_URL!,
    },
} satisfies Config;
