/**
 * Estimated session length by tattoo size (minutes).
 * Uriz can adjust these labels/values to match how she actually schedules.
 */
const SIZE_DURATION_MINUTES: Record<string, number> = {
  "Small (up to 5cm)": 60,
  "Medium (up to 15cm)": 120,
  "Large (up to 25cm)": 180,
  "Half Sleeve": 240,
  "Full Sleeve": 420,
  "Back Piece": 480,
};

const DEFAULT_DURATION = 60;

export function durationMinutesFromSize(size: string): number {
  const trimmed = size.trim();
  if (SIZE_DURATION_MINUTES[trimmed]) {
    return SIZE_DURATION_MINUTES[trimmed];
  }
  const lower = trimmed.toLowerCase();
  if (lower.includes("small")) return 60;
  if (lower.includes("medium")) return 120;
  if (lower.includes("large")) return 180;
  if (lower.includes("half sleeve")) return 240;
  if (lower.includes("full sleeve")) return 420;
  if (lower.includes("back")) return 480;
  return DEFAULT_DURATION;
}

export function formatDurationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) return `${h} hr${h === 1 ? "" : "s"}`;
  return `${h} hr${h === 1 ? "" : "s"} ${m} min`;
}

export const BOOKING_SIZE_OPTIONS = Object.keys(SIZE_DURATION_MINUTES);
