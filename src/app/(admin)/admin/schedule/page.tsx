"use client";

import {
  getSchedule,
  createScheduleBlock,
  deleteScheduleBlock,
  setAvailability,
} from "@/lib/api/schedule";
import type {
  WeekSchedule,
  ScheduleBlock,
  ScheduleBooking,
  ArtistAvailabilitySlot,
} from "@/types/schedule";
import { ChevronLeft, ChevronRight, Lock, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_HOUR_START = 9;
const DEFAULT_HOUR_END = 18;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/** dayIndex in grid (0=Mon ... 6=Sun) -> dayOfWeek (0=Sun, 1=Mon, ... 6=Sat) */
function dayIndexToDayOfWeek(dayIndex: number): number {
  return dayIndex === 6 ? 0 : dayIndex + 1;
}

function parseHour(timeStr: string): number {
  const part = (timeStr || "09:00").split(":")[0];
  return parseInt(part ?? "9", 10) || 9;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function slotStart(weekMonday: Date, dayIndex: number, hour: number): Date {
  const d = new Date(weekMonday);
  d.setDate(d.getDate() + dayIndex);
  d.setHours(hour, 0, 0, 0);
  return d;
}

function slotKey(dayIndex: number, hour: number): string {
  return `${dayIndex}-${hour}`;
}

function formatWeekRange(weekMonday: Date): string {
  const mon = weekMonday;
  const sun = addDays(mon, 6);
  return `${mon.getDate()} ${mon.toLocaleDateString("en-US", { month: "short" })} – ${sun.getDate()} ${sun.toLocaleDateString("en-US", { month: "short" })} ${sun.getFullYear()}`;
}

function formatDayHeader(weekMonday: Date, dayIndex: number): string {
  const d = addDays(weekMonday, dayIndex);
  return d.getDate().toString();
}

type CellContent =
  | { type: "off" }
  | { type: "available" }
  | { type: "blocked"; block: ScheduleBlock }
  | { type: "booking"; booking: ScheduleBooking };

function getHourRangeFromAvailability(
  availability: ArtistAvailabilitySlot[]
): { start: number; end: number } {
  if (!availability.length)
    return { start: DEFAULT_HOUR_START, end: DEFAULT_HOUR_END };
  let start = 24,
    end = 0;
  availability.forEach((a) => {
    const s = parseHour(a.startTime);
    const e = parseHour(a.endTime);
    if (s < start) start = s;
    if (e > end) end = e;
  });
  return {
    start: start > 23 ? DEFAULT_HOUR_START : start,
    end: end < 1 ? DEFAULT_HOUR_END : end,
  };
}

function isSlotWithinAvailability(
  dayIndex: number,
  hour: number,
  availability: ArtistAvailabilitySlot[]
): boolean {
  const dayOfWeek = dayIndexToDayOfWeek(dayIndex);
  const slot = availability.find((a) => a.dayOfWeek === dayOfWeek);
  if (!slot) return false;
  const startH = parseHour(slot.startTime);
  const endH = parseHour(slot.endTime);
  return hour >= startH && hour < endH;
}

function buildSlotMap(
  weekMonday: Date,
  availability: ArtistAvailabilitySlot[],
  blocks: ScheduleBlock[],
  bookings: ScheduleBooking[],
  hourStart: number,
  hourEnd: number
): Map<string, CellContent> {
  const map = new Map<string, CellContent>();

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    for (let hour = hourStart; hour < hourEnd; hour++) {
      const key = slotKey(dayIndex, hour);
      if (!isSlotWithinAvailability(dayIndex, hour, availability)) {
        map.set(key, { type: "off" });
        continue;
      }
      const start = slotStart(weekMonday, dayIndex, hour);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      const booking = bookings.find((b) => {
        const bStart = new Date(b.scheduledAt);
        const bEnd = new Date(
          bStart.getTime() + b.durationMinutes * 60 * 1000
        );
        return bStart < end && bEnd > start;
      });
      if (booking) {
        map.set(key, { type: "booking", booking });
        continue;
      }
      const block = blocks.find(
        (b) => new Date(b.startTime) < end && new Date(b.endTime) > start
      );
      if (block) {
        map.set(key, { type: "blocked", block });
        continue;
      }
      map.set(key, { type: "available" });
    }
  }
  return map;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SchedulePage() {
  const [weekMonday, setWeekMonday] = useState<Date>(() => getMonday(new Date()));
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [saveAvailabilityLoading, setSaveAvailabilityLoading] = useState(false);
  const [availabilitySaveMessage, setAvailabilitySaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [editingAvailability, setEditingAvailability] = useState<
    { dayOfWeek: number; startTime: string; endTime: string; enabled: boolean }[]
  >(
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      startTime: "12:00",
      endTime: "20:00",
      enabled: i >= 1 && i <= 3,
    }))
  );

  const syncEditingFromSchedule = useCallback((s: WeekSchedule | null) => {
    if (!s) return;
    const byDay = new Map((s.availability ?? []).map((a) => [a.dayOfWeek, a]));
    setEditingAvailability((prev) =>
      prev.map((p) => {
        const a = byDay.get(p.dayOfWeek);
        if (!a) return { ...p, enabled: false };
        const start =
          a.startTime.length === 5 ? a.startTime : a.startTime.slice(0, 5);
        const end =
          a.endTime.length === 5 ? a.endTime : a.endTime.slice(0, 5);
        return {
          dayOfWeek: p.dayOfWeek,
          startTime: start,
          endTime: end,
          enabled: true,
        };
      })
    );
  }, []);

  const fetchSchedule = useCallback(async () => {
    const m = weekMonday;
    const weekStartStr = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}-${String(m.getDate()).padStart(2, "0")}`;
    setLoading(true);
    setError(null);
    const res = await getSchedule(weekStartStr);
    setLoading(false);
    if (res.success && res.data) {
      setSchedule(res.data);
      syncEditingFromSchedule(res.data);
    } else {
      setError(res.error ?? "Failed to load schedule");
    }
  }, [weekMonday, syncEditingFromSchedule]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleSaveAvailability = async () => {
    setAvailabilitySaveMessage(null);
    const artistId = schedule?.defaultArtistId;
    if (!artistId) {
      setAvailabilitySaveMessage({
        type: "error",
        text: "No artist in the database. Add an artist (e.g. Uriz) in the Artists/DB first, then save weekly hours.",
      });
      return;
    }
    setSaveAvailabilityLoading(true);
    const slots = editingAvailability
      .filter((e) => e.enabled)
      .map((e) => ({
        dayOfWeek: e.dayOfWeek,
        startTime: e.startTime,
        endTime: e.endTime,
      }));
    const res = await setAvailability(artistId, slots);
    setSaveAvailabilityLoading(false);
    if (res.success && res.data) {
      setSchedule((prev) =>
        prev ? { ...prev, availability: res.data! } : null
      );
      setAvailabilitySaveMessage({ type: "success", text: "Weekly hours saved." });
      setTimeout(() => setAvailabilitySaveMessage(null), 3000);
    } else {
      setAvailabilitySaveMessage({
        type: "error",
        text: res.error ?? "Failed to save availability",
      });
    }
  };

  const handlePrevWeek = () => {
    setWeekMonday((prev) => addDays(prev, -7));
  };
  const handleNextWeek = () => {
    setWeekMonday((prev) => addDays(prev, 7));
  };
  const handleThisWeek = () => {
    setWeekMonday(getMonday(new Date()));
  };

  const handleBlockSlot = async (dayIndex: number, hour: number) => {
    if (!schedule?.defaultArtistId) {
      setError("No artist set. Add an artist first.");
      return;
    }
    const start = slotStart(weekMonday, dayIndex, hour);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    const key = slotKey(dayIndex, hour);
    setActionLoading(key);
    setError(null);
    const res = await createScheduleBlock(
      schedule.defaultArtistId,
      start.toISOString(),
      end.toISOString()
    );
    setActionLoading(null);
    if (res.success && res.data) {
      setSchedule((prev) =>
        prev
          ? {
              ...prev,
              blocks: [...prev.blocks, res.data!],
            }
          : null
      );
    } else {
      setError(res.error ?? "Failed to block time");
    }
  };

  const handleUnblockSlot = async (blockId: string) => {
    setActionLoading(blockId);
    setError(null);
    const res = await deleteScheduleBlock(blockId);
    setActionLoading(null);
    if (res.success) {
      setSchedule((prev) =>
        prev
          ? {
              ...prev,
              blocks: prev.blocks.filter((b) => b.id !== blockId),
            }
          : null
      );
    } else {
      setError(res.error ?? "Failed to unblock");
    }
  };

  if (loading && !schedule) {
    return (
      <div className="p-8 max-w-[1600px] mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const { start: hourStart, end: hourEnd } = schedule?.availability?.length
    ? getHourRangeFromAvailability(schedule.availability)
    : { start: DEFAULT_HOUR_START, end: DEFAULT_HOUR_END };

  const slotMap = schedule
    ? buildSlotMap(
        weekMonday,
        schedule.availability,
        schedule.blocks,
        schedule.bookings,
        hourStart,
        hourEnd
      )
    : new Map<string, CellContent>();

  const totalBookings = schedule?.bookings.length ?? 0;
  const blockedHours =
    schedule?.blocks.reduce((sum, b) => {
      const s = new Date(b.startTime).getTime();
      const e = new Date(b.endTime).getTime();
      return sum + (e - s) / (60 * 60 * 1000);
    }, 0) ?? 0;
  const totalSlots = 7 * (hourEnd - hourStart);
  const bookedSlots =
    schedule?.bookings.reduce((sum, b) => {
      return sum + Math.ceil(b.durationMinutes / 60);
    }, 0) ?? 0;
  const blockedSlots =
    schedule?.blocks.reduce((sum, b) => {
      const s = new Date(b.startTime).getTime();
      const e = new Date(b.endTime).getTime();
      return sum + Math.ceil((e - s) / (60 * 60 * 1000));
    }, 0) ?? 0;
  const availableSlots = totalSlots - bookedSlots - blockedSlots;

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Weekly availability */}
      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
          Your weekly hours
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Set which days you work and the time window. Bookings can only be made within these hours.
        </p>
        {availabilitySaveMessage && (
          <div
            className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
              availabilitySaveMessage.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {availabilitySaveMessage.text}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {DAY_NAMES.map((name, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 rounded-lg border border-white/10 bg-white/[0.02]"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingAvailability[i]?.enabled ?? false}
                  onChange={(e) =>
                    setEditingAvailability((prev) => {
                      const next = [...prev];
                      next[i] = { ...next[i]!, enabled: e.target.checked };
                      return next;
                    })
                  }
                  className="rounded border-white/20 bg-black text-white"
                />
                <span className="text-sm font-medium text-white">{name}</span>
              </label>
              {editingAvailability[i]?.enabled && (
                <>
                  <input
                    type="time"
                    value={editingAvailability[i]!.startTime}
                    onChange={(e) =>
                      setEditingAvailability((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i]!, startTime: e.target.value };
                        return next;
                      })
                    }
                    className="rounded border border-white/10 bg-black px-2 py-1.5 text-xs text-white"
                  />
                  <input
                    type="time"
                    value={editingAvailability[i]!.endTime}
                    onChange={(e) =>
                      setEditingAvailability((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i]!, endTime: e.target.value };
                        return next;
                      })
                    }
                    className="rounded border border-white/10 bg-black px-2 py-1.5 text-xs text-white"
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={handleSaveAvailability}
            disabled={saveAvailabilityLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saveAvailabilityLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save weekly hours
          </button>
        </div>
      </div>

      {/* Header: legend + week nav */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-white/20 border border-white/30" />
            <span className="text-xs text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-zinc-700 border border-zinc-600" />
            <span className="text-xs text-gray-400">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-zinc-900 border border-zinc-700" />
            <span className="text-xs text-gray-400">Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-sm bg-transparent border border-white/10" />
            <span className="text-xs text-gray-500">Not working</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Previous week"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleThisWeek}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition"
          >
            This week
          </button>
          <button
            type="button"
            onClick={handleNextWeek}
            className="p-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Next week"
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="ml-2 text-sm font-semibold text-white min-w-[200px]">
            {formatWeekRange(weekMonday)}
          </span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {schedule && schedule.bookings.length === 0 && schedule.blocks.length === 0 && (
        <p className="text-sm text-gray-500">
          No bookings this week. Use the Bookings page to create appointments with a date/time; they will appear here. Click an available slot to block time.
        </p>
      )}

      {/* Calendar grid */}
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
        <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-white/10">
          <div />
          {DAY_LABELS.map((label, dayIndex) => (
            <div
              key={label}
              className="p-3 border-r border-white/10 text-center"
            >
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {label}
              </p>
              <p className="text-lg font-bold text-white">
                {formatDayHeader(weekMonday, dayIndex)}
              </p>
            </div>
          ))}
        </div>

        {Array.from(
          { length: hourEnd - hourStart },
          (_, i) => hourStart + i
        ).map(
          (hour) => (
            <div
              key={hour}
              className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-white/5 min-h-[64px]"
            >
              <div className="flex items-center justify-center border-r border-white/10 px-2">
                <span className="text-[10px] font-bold text-gray-500">
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const key = slotKey(dayIndex, hour);
                const content = slotMap.get(key);
                const isActionLoading =
                  actionLoading === key || (content?.type === "blocked" && content.block && actionLoading === content.block.id);

                return (
                  <div
                    key={key}
                    className="border-r border-white/5 p-1 min-h-[64px] flex flex-col"
                  >
                    {content?.type === "off" && (
                      <div className="w-full h-full min-h-[56px] rounded-lg bg-transparent border border-white/5 flex items-center justify-center text-gray-600 text-[10px]">
                        —
                      </div>
                    )}
                    {content?.type === "available" && (
                      <button
                        type="button"
                        onClick={() => handleBlockSlot(dayIndex, hour)}
                        disabled={!schedule?.defaultArtistId || !!actionLoading}
                        className="w-full h-full min-h-[56px] rounded-lg bg-white/5 hover:bg-white/10 border border-dashed border-white/10 flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:text-white transition disabled:opacity-50 disabled:pointer-events-none"
                        title="Click to block this hour"
                      >
                        {isActionLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                              Available
                            </span>
                            <span className="text-[9px] text-gray-500">
                              + Block time
                            </span>
                          </>
                        )}
                      </button>
                    )}
                    {content?.type === "blocked" && (
                      <button
                        type="button"
                        onClick={() => handleUnblockSlot(content.block.id)}
                        disabled={!!actionLoading}
                        className="w-full h-full min-h-[56px] rounded-lg bg-zinc-900 border border-zinc-700 flex flex-col items-center justify-center gap-0.5 text-gray-500 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
                        title="Click to unblock"
                      >
                        {isActionLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            <Lock className="size-3.5" />
                            <span className="text-[10px] font-semibold uppercase tracking-wider">
                              Blocked
                            </span>
                          </>
                        )}
                      </button>
                    )}
                    {content?.type === "booking" && (
                      <Link
                        href={`/admin/bookings/${content.booking.id}`}
                        className="w-full h-full min-h-[56px] rounded-lg bg-zinc-700/80 border border-zinc-600 flex flex-col items-stretch justify-center p-2 hover:bg-zinc-600/80 transition text-left no-underline"
                      >
                        <p className="text-xs font-semibold text-white truncate">
                          {content.booking.firstName} {content.booking.lastName}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">
                          {content.booking.description?.slice(0, 24) || content.booking.placement}
                          {(content.booking.description?.length ?? 0) > 24 ? "…" : ""}
                        </p>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a]">
          <p className="text-xs text-gray-500 mb-1">Bookings this week</p>
          <p className="text-xl font-bold text-white">{totalBookings}</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a]">
          <p className="text-xs text-gray-500 mb-1">Blocked hours</p>
          <p className="text-xl font-bold text-white">
            {blockedHours.toFixed(1)} h
          </p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a]">
          <p className="text-xs text-gray-500 mb-1">Available slots</p>
          <p className="text-xl font-bold text-white">{availableSlots}</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a]">
          <p className="text-xs text-gray-500 mb-1">Total slots</p>
          <p className="text-xl font-bold text-white">{totalSlots}</p>
        </div>
      </div>
    </div>
  );
}
