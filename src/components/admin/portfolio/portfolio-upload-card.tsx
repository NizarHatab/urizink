import { FiPlus } from "react-icons/fi";

export default function PortfolioUploadCard() {
  return (
    <div className="group border-2 border-dashed border-white/10 rounded-xl min-h-[350px] flex flex-col items-center justify-center cursor-pointer hover:border-white/40 transition">
      <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition">
        <FiPlus className="text-3xl text-gray-500 group-hover:text-white" />
      </div>

      <p className="text-gray-500 group-hover:text-white font-bold text-sm">
        Upload New Work
      </p>
    </div>
  );
}
