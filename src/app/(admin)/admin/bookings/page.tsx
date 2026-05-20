"use client";

import StatusBadge from "@/components/admin/status-badge";
import { getBookings } from "@/lib/api/bookings";
import { Booking, BookingStatus } from "@/types";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type StatusFilter = "all" | BookingStatus | "upcoming";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function formatScheduled(scheduledAt?: string) {
  if (!scheduledAt) return { date: "—", time: "—" };
  const d = new Date(scheduledAt);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

function filterBookings(
  bookings: Booking[],
  statusFilter: StatusFilter
): Booking[] {
  if (statusFilter === "all") return bookings;
  if (statusFilter === "upcoming") {
    const now = new Date();
    return bookings.filter(
      (b) =>
        (b.status === "pending" || b.status === "confirmed") &&
        b.scheduledAt &&
        new Date(b.scheduledAt) >= now
    );
  }
  return bookings.filter((b) => b.status === statusFilter);
}

function bookingDisplayName(b: Booking) {
  return `${b.firstName} ${b.lastName}`.trim() || "—";
}

function bookingInitials(name: string) {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function BookingMobileCard({ booking }: { booking: Booking }) {
  const name = bookingDisplayName(booking);
  const initials = bookingInitials(name);
  const { date, time } = formatScheduled(booking.scheduledAt);

  return (
    <Link
      href={`/admin/bookings/${booking.id}`}
      className="block border-b border-white/5 p-4 transition-colors active:bg-white/[0.03] last:border-b-0 no-underline"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{name}</p>
              <p className="truncate text-[10px] text-gray-500">
                {booking.email ?? "—"}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-gray-300">
            {booking.description || "—"}
          </p>
          <p className="mt-1 text-[10px] text-gray-500">
            {booking.placement} / {booking.size}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="size-3.5 shrink-0" />
            <span>
              {date}
              <span className="text-gray-500"> · {time}</span>
            </span>
          </p>
        </div>
        <ChevronRight
          className="mt-1 size-5 shrink-0 text-gray-500"
          aria-hidden
        />
      </div>
    </Link>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    let cancelled = false;
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      const response = await getBookings();
      if (cancelled) return;
      if (response.success && Array.isArray(response.data)) {
        setBookings(response.data);
      } else {
        setBookings([]);
        setError(response.error ?? "Failed to fetch bookings");
      }
      setLoading(false);
    };
    fetchBookings();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = filterBookings(bookings, statusFilter);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] w-full max-w-7xl items-center justify-center">
        <p className="text-gray-500">Loading bookings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const emptyMessage = (
    <p className="px-4 py-12 text-center text-sm text-gray-500 md:px-6">
      No bookings match the selected filter.
    </p>
  );

  return (
    <div className="w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`min-h-[44px] rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                statusFilter === f.value
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
        {/* Mobile: cards */}
        <div className="md:hidden">
          {filtered.length === 0 ? (
            emptyMessage
          ) : (
            filtered.map((b) => <BookingMobileCard key={b.id} booking={b} />)
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Client
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Service
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Date & time
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  Status
                </th>
                <th className="w-10 px-6 py-4" aria-hidden />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No bookings match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const { date, time } = formatScheduled(b.scheduledAt);
                  const name = bookingDisplayName(b);
                  const initials = bookingInitials(name);
                  return (
                    <tr key={b.id} className="group">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="flex items-center gap-3 text-white no-underline hover:text-white"
                        >
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {name}
                            </p>
                            <p className="truncate text-[10px] text-gray-500">
                              {b.email ?? "—"}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="block text-sm text-gray-300 no-underline hover:text-white"
                        >
                          <p className="max-w-[200px] truncate">
                            {b.description}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {b.placement} / {b.size}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-300 no-underline hover:text-white"
                        >
                          <Calendar className="size-3.5 shrink-0 text-gray-500" />
                          <span>
                            {date}
                            <span className="ml-1 text-gray-500">{time}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-block no-underline"
                        >
                          <StatusBadge status={b.status} />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-flex size-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white"
                          aria-label={`View booking for ${name}`}
                        >
                          <ChevronRight className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
