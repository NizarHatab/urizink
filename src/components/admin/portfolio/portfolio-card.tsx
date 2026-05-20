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
    <article className="group relative bg-[#0a0a0a] border border-white/20 rounded-xl overflow-hidden hover:border-white/50 transition">
      <div className="aspect-[4/5] relative overflow-hidden bg-[var(--ink-gray-900)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={title}
        />
        <div className="absolute inset-0 hidden md:flex items-end p-4 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2 w-full">
            <button
              type="button"
              onClick={() => onDelete(id)}
              className="flex-1 bg-red-600/90 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-500 flex items-center justify-center gap-1 min-h-[44px]"
            >
              <FiTrash2 className="inline shrink-0" /> Remove
            </button>
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 min-h-[44px] min-w-[44px] bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 text-white flex items-center justify-center"
              title="Open image"
            >
              <FiExternalLink />
            </a>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex md:hidden gap-2 p-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-10">
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex-1 bg-red-600 text-white py-3 rounded-lg text-xs font-bold active:bg-red-500 flex items-center justify-center gap-1 min-h-[44px]"
          >
            <FiTrash2 className="shrink-0" /> Delete
          </button>
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] min-w-[44px] px-3 bg-white/15 border border-white/20 rounded-lg text-white flex items-center justify-center"
            title="Open image"
          >
            <FiExternalLink />
          </a>
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
    </article>
  );
}
