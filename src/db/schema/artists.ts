import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const artists = pgTable("artists", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  specialty: varchar("specialty", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
