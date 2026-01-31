// src/db/schema/portfolio.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { artists } from "./artists";

export const portfolio = pgTable("portfolio", {
  id: uuid("id").defaultRandom().primaryKey(),

  artistId: uuid("artist_id")
    .notNull()
    .references(() => artists.id, { onDelete: "cascade" }),

  title: varchar("title", { length: 150 }).notNull(),

  imageUrl: text("image_url").notNull(),

  style: varchar("style", { length: 50 }),

  tags: text("tags").array(), // 🔥 MUCH better than CSV string

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
