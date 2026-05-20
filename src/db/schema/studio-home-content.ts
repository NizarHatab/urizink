import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const studioHomeContent = pgTable("studio_home_content", {
  id: uuid("id").defaultRandom().primaryKey(),
  singletonKey: varchar("singleton_key", { length: 32 }).notNull().unique(),
  bioHeading: varchar("bio_heading", { length: 200 }),
  bioBody: text("bio_body"),
  bioPublished: boolean("bio_published").default(false).notNull(),
  aboutPage: jsonb("about_page"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const HOME_CONTENT_KEY = "main" as const;
