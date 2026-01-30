// src/db/schema/artists.ts
import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const artists = pgTable("artists", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  instagram: varchar("instagram", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
