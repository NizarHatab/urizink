import { FiExternalLink, FiTrash2 } from "react-icons/fi";

type Props = {
  id: string;
  title: string;
  studio: string;
  tags: string[];
  image: string;
  onDelete: (id: string) => void;
};

export default function PortfolioCard({
  id,
  title,
  studio,
  tags,
  image,
  onDelete,
}: Props) {
  return (
    <div className="group relative bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden hover:border-white/50 transition">
      <div
        className="aspect-[4/5] bg-center bg-cover relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-end p-4">
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="flex-1 bg-red-600/90 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-500 flex items-center justify-center gap-1"
            >
              <FiTrash2 className="inline" /> Remove
            </button>
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-white flex items-center justify-center"
              title="Open image"
            >
              <FiExternalLink />
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <h4 className="text-sm font-bold truncate mb-1">{title}</h4>
        <p className="text-xs text-gray-500">{studio}</p>
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
