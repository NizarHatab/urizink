// src/db/schema/bookings.ts
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  artistId: uuid("artist_id"),
  subject: varchar("subject", { length: 100 }),
  description: text("description").notNull(),
  status: varchar("status", { length: 30 }).notNull(),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
