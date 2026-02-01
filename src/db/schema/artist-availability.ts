// Artist's recurring weekly working hours (e.g. Mon 12:00–20:00, Tue 12:00–20:00).
// One row per (artist, day_of_week). Used to determine which days/hours are bookable.
import {
  pgTable,
  uuid,
  smallint,
  time,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { artists } from "./artists";

export const artistWeeklyAvailability = pgTable(
  "artist_weekly_availability",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    /** 0 = Sunday, 1 = Monday, ... 6 = Saturday */
    dayOfWeek: smallint("day_of_week").notNull(),
    /** Working window start, e.g. 12:00 */
    startTime: time("start_time").notNull(),
    /** Working window end, e.g. 20:00 (8 PM) */
    endTime: time("end_time").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("artist_weekly_availability_artist_idx").on(table.artistId),
    index("artist_weekly_availability_artist_day_idx").on(
      table.artistId,
      table.dayOfWeek
    ),
  ]
);
