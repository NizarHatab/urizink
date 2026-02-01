// src/db/schema/index.ts
import { pgTable, uuid, varchar, timestamp, text, boolean, integer } from "drizzle-orm/pg-core";

export * from "./users";
export * from "./artists";
export * from "./bookings";
export * from "./portfolio";
export * from "./reviews";
export * from "./schedule";
export * from "./artist-availability";
export * from "./enums";