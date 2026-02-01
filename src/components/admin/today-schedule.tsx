import { Clock } from "lucide-react";
import Link from "next/link";

export interface ScheduleItem {
  id: string;
  time: string;
  name: string;
  meta: string;
  active?: boolean;
}

export default function TodaySchedule({
  schedule = [],
  loading = false,
}: {
  schedule?: ScheduleItem[];
  loading?: boolean;
}) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink-gray-500)]">
          Today’s schedule
        </h3>
        <span className="text-[11px] font-medium text-[var(--ink-gray-500)]">
          {today}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--ink-border)] bg-[var(--ink-black)]">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-[var(--ink-gray-500)]">
            Loading…
          </div>
        ) : schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <Clock className="h-10 w-10 text-[var(--ink-gray-700)]" />
            <p className="text-sm text-[var(--ink-gray-500)]">
              No sessions today
            </p>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {schedule.map((s) => (
              <Link
                key={s.id}
                href="/admin/bookings"
                className={`block rounded-lg border-l-2 py-2 pl-4 pr-3 transition-colors hover:bg-white/[0.03] ${
                  s.active
                    ? "border-white bg-white/5"
                    : "border-[var(--ink-gray-800)]"
                }`}
              >
                <p
                  className={`text-[11px] font-semibold uppercase tracking-wider ${
                    s.active ? "text-white" : "text-[var(--ink-gray-500)]"
                  }`}
                >
                  {s.time}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">{s.name}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--ink-gray-500)]">
                  {s.meta}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
