// src/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

export const scheduleStatusEnum = pgEnum("schedule_status", [
    "available",
    "booked",
    "blocked",
]);