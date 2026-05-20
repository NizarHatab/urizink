/** Studio wall-clock timezone (Lebanon by default). */
export const STUDIO_TIMEZONE =
  process.env.STUDIO_TIMEZONE?.trim() || "Asia/Beirut";

const WEEKDAY_TO_NUM: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

type WallParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function wallPartsInStudio(instant: Date): WallParts {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: STUDIO_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(instant).map((p) => [p.type, p.value])
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

/** Calendar day + wall time in studio TZ → UTC instant. */
export function studioWallToUtc(
  dateYmd: string,
  hour: number,
  minute: number
): Date {
  const [y, m, d] = dateYmd.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);

  let utcMs = Date.UTC(y, m - 1, d, hour, minute, 0);

  for (let i = 0; i < 8; i++) {
    const w = wallPartsInStudio(new Date(utcMs));
    if (
      w.year === y &&
      w.month === m &&
      w.day === d &&
      w.hour === hour &&
      w.minute === minute
    ) {
      return new Date(utcMs);
    }
    const deltaMinutes =
      (hour - w.hour) * 60 + (minute - w.minute) + (d - w.day) * 24 * 60;
    utcMs += deltaMinutes * 60 * 1000;
  }

  return new Date(utcMs);
}

/** UTC instant → HH:mm in studio TZ. */
export function utcToStudioHm(iso: string | Date): string {
  const w = wallPartsInStudio(
    typeof iso === "string" ? new Date(iso) : iso
  );
  return `${String(w.hour).padStart(2, "0")}:${String(w.minute).padStart(2, "0")}`;
}

/** UTC instant → display label in studio TZ. */
export function formatStudioTimeLabel(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleTimeString("en-US", {
    timeZone: STUDIO_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  });
}

/** YYYY-MM-DD → dayOfWeek (0=Sun … 6=Sat) in studio TZ. */
export function studioDayOfWeek(dateYmd: string): number {
  const noon = studioWallToUtc(dateYmd, 12, 0);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: STUDIO_TIMEZONE,
    weekday: "short",
  });
  const weekday = fmt.format(noon);
  return WEEKDAY_TO_NUM[weekday] ?? noon.getDay();
}

/** Start/end of calendar day in studio TZ as UTC instants. */
export function studioDayBoundsUtc(dateYmd: string): {
  dayStart: Date;
  dayEnd: Date;
} {
  const dayStart = studioWallToUtc(dateYmd, 0, 0);
  const dayEnd = new Date(studioWallToUtc(dateYmd, 23, 59).getTime() + 59_999);
  return { dayStart, dayEnd };
}
