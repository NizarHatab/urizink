// src/db/schema/schedule.ts
import { pgTable, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

export const schedule = pgTable("schedule", {
  id: uuid("id").defaultRandom().primaryKey(),
  artistId: uuid("artist_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: varchar("status", { length: 20 }).notNull(),
});
