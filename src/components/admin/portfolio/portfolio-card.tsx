import { FiEdit, FiEye, FiMoreVertical } from "react-icons/fi";

interface Props {
  title: string;
  artist: string;
  tags: string[];
  image: string;
}

export default function PortfolioCard({
  title,
  artist,
  tags,
  image,
}: Props) {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden hover:border-white/50 transition">
      <div
        className="aspect-[4/5] bg-center bg-cover"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
          <div className="flex gap-2 w-full">
            <button className="flex-1 bg-white text-black py-2 rounded-lg text-xs font-bold hover:bg-gray-200">
              <FiEdit className="inline mr-1" /> Edit
            </button>

            <button className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20">
              <FiEye />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex justify-between mb-1">
          <h4 className="text-sm font-bold">{title}</h4>
          <FiMoreVertical className="text-gray-500 cursor-pointer hover:text-white" />
        </div>

        <p className="text-xs text-gray-500">Artist: {artist}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-wider text-gray-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
