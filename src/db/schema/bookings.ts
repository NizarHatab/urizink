// src/db/schema/bookings.ts
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  description: text("description").notNull(),
  placement: varchar("placement", { length: 50 }).notNull(),
  size: varchar("size", { length: 50 }).notNull(),
  artistId: uuid("artist_id"),
  scheduledAt: timestamp("scheduled_at"),
  status: varchar("status", { length: 20 })
    .$type<"pending" | "confirmed" | "completed" | "cancelled">()
    .default("pending")
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
