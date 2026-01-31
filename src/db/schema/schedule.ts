// src/db/schema/schedule.ts
import {
  pgTable,
  uuid,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { artists } from "./artists";
import { scheduleStatusEnum } from "./enums";

export const schedule = pgTable(
  "schedule",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),

    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),

    status: scheduleStatusEnum("schedule_status").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    artistTimeIdx: index("schedule_artist_time_idx").on(
      table.artistId,
      table.startTime
    ),
  })
);
