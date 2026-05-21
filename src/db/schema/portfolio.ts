// src/db/schema/portfolio.ts
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { portfolioCategories } from "./portfolio-categories";

export const portfolio = pgTable("portfolio", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 150 }).notNull(),

  imageUrl: text("image_url").notNull(),

  categoryId: uuid("category_id").references(() => portfolioCategories.id, {
    onDelete: "set null",
  }),

  tags: text("tags").array(),

  featuredOnHome: boolean("featured_on_home").default(false).notNull(),

  homeSortOrder: integer("home_sort_order").default(0).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
