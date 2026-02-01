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
      <div className="p-8 max-w-7xl mx-auto w-full flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading bookings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto w-full">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Bookings</h1>
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition ${
                statusFilter === f.value
                  ? "bg-white text-black border-white"
                  : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Client
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Service
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest hidden md:table-cell">
                  Artist
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Date & time
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 w-10" aria-hidden />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500 text-sm"
                  >
                    No bookings match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const { date, time } = formatScheduled(b.scheduledAt);
                  const name =
                    `${b.firstName} ${b.lastName}`.trim() || "—";
                  const initials = name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?";
                  return (
                    <tr key={b.id} className="group">
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="flex items-center gap-3 text-white hover:text-white no-underline"
                        >
                          <div className="size-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {name}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate">
                              {b.email ?? "—"}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="block text-sm text-gray-300 hover:text-white no-underline"
                        >
                          <p className="truncate max-w-[200px]">
                            {b.description}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {b.placement} / {b.size}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-gray-400 hover:text-white no-underline"
                        >
                          {b.artistId ?? "—"}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-gray-300 hover:text-white no-underline"
                        >
                          <Calendar className="size-3.5 text-gray-500 shrink-0" />
                          <span>
                            {date}
                            <span className="text-gray-500 ml-1">{time}</span>
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
                          className="inline-flex items-center justify-center size-9 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition"
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
