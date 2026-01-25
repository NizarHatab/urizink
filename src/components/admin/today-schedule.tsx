const schedule = [
  {
    time: "10:00 AM",
    name: "Marcus King",
    meta: "Artist: Viktor (Booth A)",
  },
  {
    time: "01:30 PM",
    name: "Sarah Jenks",
    meta: "Artist: Elena (Booth C)",
    active: true,
  },
  {
    time: "04:00 PM",
    name: "Consultation",
    meta: "Walk-in Slot",
  },
];

export default function TodaySchedule() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          Today’s Schedule
        </h3>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Today
        </p>
      </div>

      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 space-y-5">
        {schedule.map((s, i) => (
          <div
            key={i}
            className={`relative pl-5 border-l-2 ${
              s.active
                ? "border-white"
                : "border-white/20"
            }`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${
                s.active
                  ? "text-white"
                  : "text-gray-500"
              }`}
            >
              {s.time}
            </p>
            <p className="text-sm font-bold mt-1">
              {s.name}
            </p>
            <p className="text-xs text-gray-500">
              {s.meta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
