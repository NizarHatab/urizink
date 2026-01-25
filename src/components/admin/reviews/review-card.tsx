import { FiStar } from "react-icons/fi";

export default function ReviewCard({
  name,
  rating,
  text,
  time,
}: {
  name: string;
  rating: number;
  text: string;
  time: string;
}) {
  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 hover:border-white/20 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[10px] text-gray-500 uppercase">Verified Client</p>
        </div>

        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <FiStar key={i} className="text-white text-sm" />
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-300 italic mb-4">{text}</p>

      <div className="flex justify-between pt-4 border-t border-white/5">
        <span className="text-[10px] text-gray-500">{time}</span>
        <button className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-white">
          Reply to Review
        </button>
      </div>
    </div>
  );
}
