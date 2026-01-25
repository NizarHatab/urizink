import { FiSearch, FiFilter, FiPlus } from "react-icons/fi";

export default function PortfolioHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold">Portfolio Management</h2>
        <p className="text-sm text-gray-500">
          Manage and showcase the studio’s best tattoo pieces.
        </p>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
          <FiFilter />
          Filter
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition">
          <FiPlus />
          Add Work
        </button>
      </div>
    </div>
  );
}
