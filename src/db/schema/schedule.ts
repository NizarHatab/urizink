// src/db/schema/schedule.ts
import { pgTable, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { scheduleStatusEnum } from "./enums";

export const schedule = pgTable(
  "schedule",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    status: scheduleStatusEnum("schedule_status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    startTimeIdx: index("schedule_start_time_idx").on(table.startTime),
  })
);
