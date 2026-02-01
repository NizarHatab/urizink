import { ClipboardList, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface ActivityItem {
  id: string;
  type: "booking";
  text: string;
  time: string;
}

export default function RecentActivity({
  activities = [],
  loading = false,
}: {
  activities?: ActivityItem[];
  loading?: boolean;
}) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink-gray-500)]">
          Recent activity
        </h3>
        <Link
          href="/admin/bookings"
          className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-gray-500)] transition-colors hover:text-white"
        >
          View all
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--ink-border)] bg-[var(--ink-black)]">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-[var(--ink-gray-500)]">
            Loading…
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <ClipboardList className="h-10 w-10 text-[var(--ink-gray-700)]" />
            <p className="text-sm text-[var(--ink-gray-500)]">
              No recent activity
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--ink-border)]">
            {activities.map((a) => (
              <li key={a.id}>
                <Link
                  href="/admin/bookings"
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <ClipboardList className="h-4 w-4 text-[var(--ink-gray-500)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {a.text}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--ink-gray-500)]">
                      {a.time}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--ink-gray-600)]" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
