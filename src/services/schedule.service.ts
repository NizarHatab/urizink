import { db } from "@/db";
import { bookings } from "@/db/schema/bookings";
import { schedule } from "@/db/schema/schedule";
import { studioWeeklyHours } from "@/db/schema/studio-weekly-hours";
import { users } from "@/db/schema/users";
import {
  DEFAULT_WEEKLY_HOURS,
  formatDateYmd,
  parseHour,
  parseMinute,
  rangesOverlap,
} from "@/lib/schedule-helpers";
import {
  formatStudioTimeLabel,
  studioDayBoundsUtc,
  studioDayOfWeek,
  studioWallToUtc,
} from "@/lib/studio-time";
import { eq, and, gte, lt, gt } from "drizzle-orm";
import type {
  ArtistAvailabilitySlot,
  ScheduleBlock,
  ScheduleBooking,
  WeekSchedule,
  AvailableSlot,
} from "@/types/schedule";

const SLOT_STEP_MINUTES = 30;

async function ensureDefaultWeeklyHours(): Promise<void> {
  const existing = await db.select({ id: studioWeeklyHours.id }).from(studioWeeklyHours).limit(1);
  if (existing.length > 0) return;
  await db.insert(studioWeeklyHours).values(
    DEFAULT_WEEKLY_HOURS.map((row) => ({
      dayOfWeek: row.dayOfWeek,
      startTime: row.startTime,
      endTime: row.endTime,
    }))
  );
}

function rowToSlot(row: {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
}): ArtistAvailabilitySlot {
  return {
    id: row.id,
    dayOfWeek: row.dayOfWeek,
    startTime: row.startTime.slice(0, 5),
    endTime: row.endTime.slice(0, 5),
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getWeeklyAvailability(): Promise<ArtistAvailabilitySlot[]> {
  await ensureDefaultWeeklyHours();
  const rows = await db
    .select()
    .from(studioWeeklyHours)
    .orderBy(studioWeeklyHours.dayOfWeek);
  return rows.map(rowToSlot);
}

export async function setWeeklyAvailability(
  slots: { dayOfWeek: number; startTime: string; endTime: string }[]
): Promise<ArtistAvailabilitySlot[]> {
  await db.delete(studioWeeklyHours);
  if (slots.length > 0) {
    await db.insert(studioWeeklyHours).values(
      slots.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime.slice(0, 5),
        endTime: s.endTime.slice(0, 5),
      }))
    );
  }
  return getWeeklyAvailability();
}

type Interval = { start: number; end: number };

async function getBusyIntervalsForDay(
  dayStart: Date,
  dayEnd: Date
): Promise<Interval[]> {
  const blockRows = await db
    .select({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })
    .from(schedule)
    .where(
      and(
        eq(schedule.status, "blocked"),
        lt(schedule.startTime, dayEnd),
        gt(schedule.endTime, dayStart)
      )
    );

  const bookingRows = await db
    .select({
      scheduledAt: bookings.scheduledAt,
      durationMinutes: bookings.durationMinutes,
      status: bookings.status,
    })
    .from(bookings)
    .where(
      and(
        gte(bookings.scheduledAt, dayStart),
        lt(bookings.scheduledAt, dayEnd)
      )
    );

  const busy: Interval[] = [];

  for (const b of blockRows) {
    busy.push({
      start: b.startTime.getTime(),
      end: b.endTime.getTime(),
    });
  }

  for (const b of bookingRows) {
    if (b.status === "cancelled" || !b.scheduledAt) continue;
    const start = b.scheduledAt.getTime();
    const duration = (b.durationMinutes ?? 60) * 60 * 1000;
    busy.push({ start, end: start + duration });
  }

  return busy;
}

function isSlotFree(
  slotStart: number,
  slotEnd: number,
  busy: Interval[]
): boolean {
  return !busy.some((b) => rangesOverlap(slotStart, slotEnd, b.start, b.end));
}

export async function getAvailableSlots(
  dateStr?: string,
  durationMinutes = 60
): Promise<AvailableSlot[]> {
  if (!dateStr) return [];

  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return [];

  const [y, m, d] = parts;
  const dateYmd = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const dayOfWeek = studioDayOfWeek(dateYmd);

  const availability = await getWeeklyAvailability();
  const dayHours = availability.find((a) => a.dayOfWeek === dayOfWeek);
  if (!dayHours) return [];

  const startH = parseHour(dayHours.startTime);
  const startM = parseMinute(dayHours.startTime);
  const endH = parseHour(dayHours.endTime);
  const endM = parseMinute(dayHours.endTime);

  const windowStart = studioWallToUtc(dateYmd, startH, startM);
  const windowEnd = studioWallToUtc(dateYmd, endH, endM);
  if (windowEnd <= windowStart) return [];

  const { dayStart, dayEnd } = studioDayBoundsUtc(dateYmd);
  const busy = await getBusyIntervalsForDay(dayStart, dayEnd);

  const now = Date.now();
  const stepMs = SLOT_STEP_MINUTES * 60 * 1000;
  const durationMs = durationMinutes * 60 * 1000;
  const slots: AvailableSlot[] = [];

  for (
    let t = windowStart.getTime();
    t + durationMs <= windowEnd.getTime();
    t += stepMs
  ) {
    if (t < now) continue;
    const slotEnd = t + durationMs;
    if (!isSlotFree(t, slotEnd, busy)) continue;

    const startDate = new Date(t);
    const endDate = new Date(slotEnd);
    slots.push({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      label: formatStudioTimeLabel(startDate),
    });
  }

  const seen = new Set<number>();
  return slots.filter((s) => {
    const ms = new Date(s.start).getTime();
    if (seen.has(ms)) return false;
    seen.add(ms);
    return true;
  });
}

export async function getAvailableDates(
  fromDate?: Date,
  weeksAhead = 4,
  durationMinutes = 60
): Promise<string[]> {
  const start = fromDate ? new Date(fromDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const dates: string[] = [];
  const totalDays = Math.max(1, weeksAhead) * 7;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const ymd = formatDateYmd(d);
    const slots = await getAvailableSlots(ymd, durationMinutes);
    if (slots.length > 0) dates.push(ymd);
  }

  return dates;
}

export async function isSlotAvailable(
  dateStr: string,
  timeHHmm: string,
  durationMinutes = 60
): Promise<boolean> {
  const slots = await getAvailableSlots(dateStr, durationMinutes);
  const normalized = timeHHmm.slice(0, 5);
  const [th, tm] = normalized.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(th) || Number.isNaN(tm)) return false;

  const targetMs = studioWallToUtc(dateStr, th, tm).getTime();
  return slots.some((s) => new Date(s.start).getTime() === targetMs);
}

export async function getScheduleForWeek(
  weekStart: Date
): Promise<WeekSchedule> {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const availability = await getWeeklyAvailability();

  const blockRows = await db
    .select({
      id: schedule.id,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
      createdAt: schedule.createdAt,
    })
    .from(schedule)
    .where(
      and(
        eq(schedule.status, "blocked"),
        lt(schedule.startTime, weekEnd),
        gt(schedule.endTime, weekStart)
      )
    );

  const blocks: ScheduleBlock[] = blockRows.map((row) => ({
    id: row.id,
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

  const bookingsForWeek: ScheduleBooking[] = bookingRows
    .filter((row) => row.status !== "cancelled" && row.scheduledAt)
    .map((row) => ({
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
  };
}

export async function createBlock(
  startTime: Date,
  endTime: Date
): Promise<ScheduleBlock> {
  const [row] = await db
    .insert(schedule)
    .values({
      startTime,
      endTime,
      status: "blocked",
    })
    .returning();

  if (!row) throw new Error("Failed to create block");

  return {
    id: row.id,
    startTime: row.startTime.toISOString(),
    endTime: row.endTime.toISOString(),
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteBlock(id: string): Promise<boolean> {
  const result = await db.delete(schedule).where(eq(schedule.id, id));
  return (result.rowCount ?? 0) > 0;
}
