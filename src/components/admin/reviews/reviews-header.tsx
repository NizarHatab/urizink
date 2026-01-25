import { FiSearch, FiBell } from "react-icons/fi";

export default function ReviewsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold">Reviews Analytics</h2>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            placeholder="Search reviews..."
            className="w-64 bg-[#111111] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5">
        <FiBell />
      </button>
    </div>
  );
}
