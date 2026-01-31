import "server-only";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
console.log("POSTGRES_URL:", process.env.POSTGRES_URL);

const sql = neon(process.env.POSTGRES_URL!);

export const db = drizzle(sql);
