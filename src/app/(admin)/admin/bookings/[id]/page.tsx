"use client";

import StatusBadge from "@/components/admin/status-badge";
import { getBookingById, updateBookingStatus } from "@/lib/api/bookings";
import { Booking } from "@/types";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      {Icon && (
        <Icon className="size-4 text-gray-500 mt-0.5 shrink-0" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-white mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<"confirm" | "cancel" | null>(
    null
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!id || actionLoading) return;
    setActionError(null);
    setActionLoading("confirm");
    const res = await updateBookingStatus(id, "confirmed");
    setActionLoading(null);
    if (res.success && res.data) {
      setBooking(res.data);
    } else {
      setActionError(res.error ?? "Failed to confirm booking");
    }
  };

  const handleCancel = async () => {
    if (!id || actionLoading) return;
    setActionError(null);
    setActionLoading("cancel");
    const res = await updateBookingStatus(id, "cancelled");
    setActionLoading(null);
    if (res.success && res.data) {
      setBooking(res.data);
    } else {
      setActionError(res.error ?? "Failed to cancel booking");
    }
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getBookingById(id).then((res) => {
      if (cancelled) return;
      if (res.success && res.data !== undefined) {
        setBooking(res.data);
        if (!res.data) setError("Booking not found");
      } else {
        setError(res.error ?? "Failed to load booking");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (booking === undefined && !error) {
    return (
      <div className="p-8 max-w-3xl mx-auto flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading booking…</p>
      </div>
    );
  }

  if (error || booking === null || !booking) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-4">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Back to bookings
        </Link>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-gray-400">{error ?? "Booking not found."}</p>
        </div>
      </div>
    );
  }

  const name = `${booking.firstName} ${booking.lastName}`.trim() || "—";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?";

  const canConfirm = booking.status === "pending";
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="p-8 max-w-3xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="size-4" />
          Back to bookings
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={booking.status} />
          {(canConfirm || canCancel) && (
            <div className="flex items-center gap-2">
              {canConfirm && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none transition"
                >
                  {actionLoading === "confirm" ? (
                    <span className="size-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Accept booking
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!!actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-red-500/50 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:pointer-events-none transition"
                >
                  {actionLoading === "cancel" ? (
                    <span className="size-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <XCircle className="size-4" />
                  )}
                  Cancel booking
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {actionError}
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-lg font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{name}</h1>
              <p className="text-xs text-gray-500">
                Created {formatDate(booking.createdAt)} at{" "}
                {formatTime(booking.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Client
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <DetailRow label="Full name" value={name} icon={User} />
              <DetailRow label="Email" value={booking.email ?? ""} icon={Mail} />
              <DetailRow label="Phone" value={booking.phone ?? ""} icon={Phone} />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Tattoo details
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <DetailRow label="Description" value={booking.description} />
              <DetailRow label="Placement" value={booking.placement} />
              <DetailRow label="Size" value={booking.size} />
              {booking.artistId && (
                <DetailRow label="Artist ID" value={booking.artistId} />
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Schedule
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <DetailRow
                label="Date"
                value={formatDate(booking.scheduledAt)}
                icon={Calendar}
              />
              <DetailRow
                label="Time"
                value={formatTime(booking.scheduledAt)}
                icon={Calendar}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Meta
            </h2>
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <DetailRow label="Booking ID" value={booking.id} />
              <DetailRow label="User ID" value={booking.userId} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
