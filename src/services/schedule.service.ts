import { db } from "@/db";
import { artistWeeklyAvailability } from "@/db/schema/artist-availability";
import { artists } from "@/db/schema/artists";
import { bookings } from "@/db/schema/bookings";
import { schedule } from "@/db/schema/schedule";
import { users } from "@/db/schema/users";
import { eq, and, gte, lt, gt, or, isNull } from "drizzle-orm";
import type {
  ArtistAvailabilitySlot,
  ScheduleBlock,
  ScheduleBooking,
  WeekSchedule,
  AvailableSlot,
} from "@/types/schedule";

/** Get the first artist (e.g. Uriz) for single-artist studio. */
export async function getDefaultArtist(): Promise<{
  id: string;
  name: string;
} | null> {
  const [row] = await db
    .select({ id: artists.id, name: artists.name })
    .from(artists)
    .limit(1);
  return row ? { id: row.id, name: row.name } : null;
}

/** Normalize time string to HH:mm for comparison. */
function timeToHHmm(t: string): string {
  if (!t) return "00:00";
  const part = t.split("T")[1] ?? t;
  const [h, m] = part.split(":");
  return `${h!.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
}

/** Get artist's recurring weekly availability (which days/hours they work). */
export async function getWeeklyAvailability(
  artistId: string
): Promise<ArtistAvailabilitySlot[]> {
  const rows = await db
    .select({
      id: artistWeeklyAvailability.id,
      artistId: artistWeeklyAvailability.artistId,
      dayOfWeek: artistWeeklyAvailability.dayOfWeek,
      startTime: artistWeeklyAvailability.startTime,
      endTime: artistWeeklyAvailability.endTime,
      createdAt: artistWeeklyAvailability.createdAt,
    })
    .from(artistWeeklyAvailability)
    .where(eq(artistWeeklyAvailability.artistId, artistId))
    .orderBy(artistWeeklyAvailability.dayOfWeek);

  return rows.map((row) => ({
    id: row.id,
    artistId: row.artistId,
    dayOfWeek: row.dayOfWeek ?? 0,
    startTime: typeof row.startTime === "string" ? timeToHHmm(row.startTime) : "09:00",
    endTime: typeof row.endTime === "string" ? timeToHHmm(row.endTime) : "18:00",
    createdAt: row.createdAt.toISOString(),
  }));
}

/** Set artist's weekly availability. Replaces all existing slots for that artist. */
export async function setWeeklyAvailability(
  artistId: string,
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
): Promise<ArtistAvailabilitySlot[]> {
  await db
    .delete(artistWeeklyAvailability)
    .where(eq(artistWeeklyAvailability.artistId, artistId));

  if (slots.length === 0) {
    return [];
  }

  const toInsert = slots.map((s) => ({
    artistId,
    dayOfWeek: s.dayOfWeek,
    startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
    endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime,
  }));

  const inserted = await db
    .insert(artistWeeklyAvailability)
    .values(toInsert)
    .returning();

  return inserted.map((row) => ({
    id: row.id,
    artistId: row.artistId,
    dayOfWeek: row.dayOfWeek ?? 0,
    startTime: typeof row.startTime === "string" ? timeToHHmm(row.startTime) : "09:00",
    endTime: typeof row.endTime === "string" ? timeToHHmm(row.endTime) : "18:00",
    createdAt: row.createdAt.toISOString(),
  }));
}

/**
 * Get all data needed for the weekly calendar: availability, blocks, and bookings.
 */
export async function getScheduleForWeek(
  weekStart: Date,
  artistId: string | null
): Promise<WeekSchedule> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const defaultArtist = await getDefaultArtist();
  const availability: ArtistAvailabilitySlot[] =
    artistId != null
      ? await getWeeklyAvailability(artistId)
      : [];

  const blockRows =
    artistId != null
      ? await db
          .select({
            id: schedule.id,
            artistId: schedule.artistId,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            status: schedule.status,
            createdAt: schedule.createdAt,
          })
          .from(schedule)
          .where(
            and(
              eq(schedule.artistId, artistId),
              eq(schedule.status, "blocked"),
              lt(schedule.startTime, weekEnd),
              gt(schedule.endTime, weekStart)
            )
          )
      : [];

  const blocks: ScheduleBlock[] = blockRows.map((row) => ({
    id: row.id,
    artistId: row.artistId,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));

  const bookingRows = await db
    .select({
      id: bookings.id,
      scheduledAt: bookings.scheduledAt,
      durationMinutes: bookings.durationMinutes,
      description: bookings.description,
      placement: bookings.placement,
      size: bookings.size,
      status: bookings.status,
      artistId: bookings.artistId,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .where(
      and(
        gte(bookings.scheduledAt, weekStart),
        lt(bookings.scheduledAt, weekEnd)
      )
    );

  const filtered = bookingRows.filter((row) => {
    if (row.status === "cancelled") return false;
    if (!row.scheduledAt) return false;
    if (artistId != null && row.artistId != null && row.artistId !== artistId)
      return false;
    return true;
  });

  const bookingsForWeek: ScheduleBooking[] = filtered.map((row) => ({
    id: row.id,
    scheduledAt: row.scheduledAt!.toISOString(),
    durationMinutes: row.durationMinutes ?? 60,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    description: row.description,
    placement: row.placement,
    size: row.size,
    status: row.status,
  }));

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    availability,
    blocks,
    bookings: bookingsForWeek,
    defaultArtistId: defaultArtist?.id ?? null,
  };
}

/**
 * Get available time slots for a given date, respecting artist's working hours,
 * blocks, existing bookings, and appointment duration.
 */
export async function getAvailableSlots(
  artistId: string,
  dateStr: string,
  durationMinutes: number = 60
): Promise<AvailableSlot[]> {
  const date = new Date(dateStr + "T00:00:00");
  if (isNaN(date.getTime())) return [];

  const dayOfWeek = date.getDay();
  const availability = await getWeeklyAvailability(artistId);
  const dayAvailability = availability.find((a) => a.dayOfWeek === dayOfWeek);
  if (!dayAvailability) return [];

  const [startH, startM] = dayAvailability.startTime.split(":").map(Number);
  const [endH, endM] = dayAvailability.endTime.split(":").map(Number);
  const windowStart = new Date(date);
  windowStart.setHours(startH, startM ?? 0, 0, 0);
  const windowEnd = new Date(date);
  windowEnd.setHours(endH, endM ?? 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const blocks = await db
    .select({ startTime: schedule.startTime, endTime: schedule.endTime })
    .from(schedule)
    .where(
      and(
        eq(schedule.artistId, artistId),
        eq(schedule.status, "blocked"),
        lt(schedule.startTime, dayEnd),
        gt(schedule.endTime, date)
      )
    );

  const bookingsThatDay = await db
    .select({
      scheduledAt: bookings.scheduledAt,
      durationMinutes: bookings.durationMinutes,
      status: bookings.status,
    })
    .from(bookings)
    .where(
      and(
        or(eq(bookings.artistId, artistId), isNull(bookings.artistId)),
        gte(bookings.scheduledAt, date),
        lt(bookings.scheduledAt, dayEnd)
      )
    );

  const allBookedRanges = bookingsThatDay
    .filter((b) => b.scheduledAt && b.status !== "cancelled")
    .map((b) => {
      const start = new Date(b.scheduledAt!);
      const end = new Date(
        start.getTime() + (b.durationMinutes ?? 60) * 60 * 1000
      );
      return { start, end };
    });

  const blockedRanges = blocks.map((b) => ({
    start: new Date(b.startTime),
    end: new Date(b.endTime),
  }));

  const slotDurationMs = durationMinutes * 60 * 1000;
  const slots: AvailableSlot[] = [];
  let slotStart = new Date(windowStart);

  while (slotStart.getTime() + slotDurationMs <= windowEnd.getTime()) {
    const slotEnd = new Date(slotStart.getTime() + slotDurationMs);
    const overlapsBlock = blockedRanges.some(
      (b) => slotStart < b.end && slotEnd > b.start
    );
    const overlapsBooking = allBookedRanges.some(
      (b) => slotStart < b.end && slotEnd > b.start
    );
    if (!overlapsBlock && !overlapsBooking) {
      const label = slotStart.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        label,
      });
    }
    slotStart = new Date(slotStart.getTime() + 60 * 60 * 1000);
  }

  return slots;
}

/**
 * Get list of dates that are bookable (artist works that day) within the next N weeks.
 */
export async function getAvailableDates(
  artistId: string,
  fromDate: Date,
  weeksAhead: number = 4
): Promise<string[]> {
  const availability = await getWeeklyAvailability(artistId);
  if (availability.length === 0) return [];

  const workingDays = new Set(availability.map((a) => a.dayOfWeek));
  const dates: string[] = [];
  const end = new Date(fromDate);
  end.setDate(end.getDate() + weeksAhead * 7);

  const cursor = new Date(fromDate);
  cursor.setHours(0, 0, 0, 0);

  while (cursor < end) {
    if (workingDays.has(cursor.getDay())) {
      dates.push(
        `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`
      );
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

/** Create a blocked time slot for the artist. */
export async function createBlock(
  artistId: string,
  startTime: Date,
  endTime: Date
): Promise<ScheduleBlock> {
  const [row] = await db
    .insert(schedule)
    .values({
      artistId,
      startTime,
      endTime,
      status: "blocked",
    })
    .returning();

  if (!row) throw new Error("Failed to create block");

  return {
    id: row.id,
    artistId: row.artistId,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

/** Remove a blocked time slot. */
export async function deleteBlock(id: string): Promise<boolean> {
  const result = await db.delete(schedule).where(eq(schedule.id, id));
  return (result.rowCount ?? 0) > 0;
}
