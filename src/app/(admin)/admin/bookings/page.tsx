
'use client'
import StatusBadge from "@/components/admin/status-badge";
import { getBookings } from "@/lib/api/bookings";
import { Booking } from "@/types";
import { useEffect, useState } from "react";
import { FiFilter, FiMoreVertical } from "react-icons/fi";

function formatScheduled(scheduledAt?: string) {
  if (!scheduledAt) return { date: "—", time: "—" };
  const d = new Date(scheduledAt);
  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const response = await getBookings();
      console.log("API RESPONSE:", response);
      console.log("DATA TYPE:", typeof response.data, response.data);
      if (response.success && Array.isArray(response.data)) {
        setBookings(response.data);
        setSuccess(true);
        setLoading(false);
      } else {
        console.error("Failed to fetch bookings:", response.error);
        setBookings([]); // safety
        setSuccess(false);
        setLoading(false);
        setError(response.error ?? "Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["All", "Pending", "Upcoming", "Completed"].map((f, i) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${i === 0
                ? "bg-white text-black border-white"
                : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white">
          <FiFilter />
          More Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 bg-white/2">
              {["Client", "Service", "Artist", "Date & Time", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {bookings.map((b) => {
              const { date, time } = formatScheduled(b.scheduledAt);
              const name = `${b.firstName} ${b.lastName}`.trim() || "—";
              const initials = name.split(" ").map((n) => n[0]).join("") || "?";
              return (
                <tr key={b.id} className="hover:bg-white/2 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{name}</p>
                        <p className="text-[10px] text-gray-500">{b.email ?? "—"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm">{b.description}</p>
                    <p className="text-[10px] text-gray-500">{b.placement} / {b.size}</p>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">{b.artistId ?? "—"}</td>

                  <td className="px-6 py-4">
                    <p className="text-sm">{date}</p>
                    <p className="text-[10px] text-gray-500">{time}</p>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
