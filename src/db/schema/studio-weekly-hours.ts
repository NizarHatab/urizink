import {
  pgTable,
  uuid,
  smallint,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const studioWeeklyHours = pgTable(
  "studio_weekly_hours",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    dayOfWeek: smallint("day_of_week").notNull(),
    startTime: varchar("start_time", { length: 8 }).notNull(),
    endTime: varchar("end_time", { length: 8 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    dayIdx: uniqueIndex("studio_weekly_hours_day_idx").on(table.dayOfWeek),
  })
);
