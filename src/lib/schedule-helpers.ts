/** Parse "HH:mm" or "HH:mm:ss" to hour 0–23 */
export function parseHour(timeStr: string): number {
  const part = (timeStr || "09:00").split(":")[0];
  return parseInt(part ?? "9", 10) || 0;
}

export function parseMinute(timeStr: string): number {
  const parts = (timeStr || "09:00").split(":");
  return parseInt(parts[1] ?? "0", 10) || 0;
}

export function formatDateYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export const DEFAULT_WEEKLY_HOURS: {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}[] = [
  { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 2, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 3, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 4, startTime: "09:00", endTime: "18:00" },
  { dayOfWeek: 5, startTime: "09:00", endTime: "18:00" },
];
