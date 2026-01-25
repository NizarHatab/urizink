import { FiChevronLeft, FiChevronRight, FiLock, FiSave } from "react-icons/fi";

export default function ScheduleHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Legend color="bg-white" label="Available" />
        <Legend color="bg-zinc-800" label="Booked" />
        <Legend color="bg-zinc-900" label="Blocked" />
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5">
          <FiLock />
          Block Time
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200">
          <FiSave />
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-3 rounded-sm ${color}`} />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
