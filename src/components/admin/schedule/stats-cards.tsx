const stats = [
  { label: "Total Bookings", value: "28 sessions" },
  { label: "Studio Occupancy", value: "84%" },
  { label: "Blocked Hours", value: "12 hours" },
  { label: "Available Slots", value: "14 slots" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="p-4 rounded-xl border border-white/10 bg-[#0a0a0a]"
        >
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <p className="text-xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
