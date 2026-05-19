import { parseHour, parseMinute } from "@/lib/schedule-helpers";
import type { ArtistAvailabilitySlot } from "@/types/schedule";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Mon → Sun display order */
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

function formatTime12h(timeStr: string): string {
  const h = parseHour(timeStr);
  const m = parseMinute(timeStr);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  if (m === 0) return `${hour12}:00 ${period}`;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatDayRange(startDay: number, endDay: number): string {
  if (startDay === endDay) return DAY_NAMES[startDay];
  return `${DAY_NAMES[startDay]} – ${DAY_NAMES[endDay]}`;
}

function slotSignature(slot: ArtistAvailabilitySlot | undefined): string {
  if (!slot) return "closed";
  return `open|${slot.startTime}|${slot.endTime}`;
}

/**
 * Groups consecutive days with the same hours into lines, e.g.
 * "Tue – Sat: 11:00 AM – 8:00 PM" and "Sun – Mon: Closed"
 */
export function formatWeeklyHoursLines(
  slots: ArtistAvailabilitySlot[]
): string[] {
  const byDay = new Map(slots.map((s) => [s.dayOfWeek, s]));

  const lines: string[] = [];
  let i = 0;

  while (i < DISPLAY_ORDER.length) {
    const startDay = DISPLAY_ORDER[i];
    const sig = slotSignature(byDay.get(startDay));
    let j = i + 1;

    while (j < DISPLAY_ORDER.length) {
      const day = DISPLAY_ORDER[j];
      if (slotSignature(byDay.get(day)) !== sig) break;
      j++;
    }

    const endDay = DISPLAY_ORDER[j - 1];
    const rangeLabel = formatDayRange(startDay, endDay);

    if (sig === "closed") {
      lines.push(`${rangeLabel}: Closed`);
    } else {
      const slot = byDay.get(startDay)!;
      lines.push(
        `${rangeLabel}: ${formatTime12h(slot.startTime)} – ${formatTime12h(slot.endTime)}`
      );
    }

    i = j;
  }

  return lines;
}
