import TimeRow from "./time-row";

const times = ["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarGrid() {
  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
      {/* HEADER */}
      <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/10">
        <div />
        {days.map((d) => (
          <div
            key={d}
            className="p-4 border-r border-white/10 text-center"
          >
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {d}
            </p>
            <p className="text-lg font-bold">18</p>
          </div>
        ))}
      </div>

      {/* TIME ROWS */}
      {times.map((t) => (
        <TimeRow key={t} time={t} />
      ))}
    </div>
  );
}
