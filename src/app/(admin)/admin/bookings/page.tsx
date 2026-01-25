import StatusBadge from "@/components/admin/status-badge";
import { FiFilter, FiMoreVertical } from "react-icons/fi";

const bookings = [
  {
    id: 1,
    name: "Marco Rossi",
    email: "m.rossi@email.com",
    service: "Full Sleeve Project",
    style: "Blackwork style",
    artist: "Viktor",
    date: "Oct 12, 2023",
    time: "10:00 AM",
    status: "pending",
  },
  {
    id: 2,
    name: "Julia Thorne",
    email: "jthorne@web.com",
    service: "Fine Line Floral",
    style: "Forearm piece",
    artist: "Elena",
    date: "Oct 14, 2023",
    time: "1:30 PM",
    status: "confirmed",
  },
  {
    id: 3,
    name: "Leon Black",
    email: "black.leon@mail.com",
    service: "Traditional Skull",
    style: "Bicep placement",
    artist: "Sarah",
    date: "Oct 05, 2023",
    time: "4:00 PM",
    status: "completed",
  },
];

export default function BookingsPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["All", "Pending", "Upcoming", "Completed"].map((f, i) => (
            <button
              key={f}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                i === 0
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
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-white/2 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold">
                      {b.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{b.name}</p>
                      <p className="text-[10px] text-gray-500">{b.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="text-sm">{b.service}</p>
                  <p className="text-[10px] text-gray-500">{b.style}</p>
                </td>

                <td className="px-6 py-4 text-sm font-medium">{b.artist}</td>

                <td className="px-6 py-4">
                  <p className="text-sm">{b.date}</p>
                  <p className="text-[10px] text-gray-500">{b.time}</p>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
