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
        {/* Always visible — works on phone, iPad, and desktop (no hover required) */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex gap-2 bg-gradient-to-t from-black via-black/95 to-transparent p-3 pt-12">
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex min-h-[44px] flex-1 touch-manipulation items-center justify-center gap-1 rounded-lg bg-red-600 py-3 text-xs font-bold text-white active:bg-red-500 [@media(hover:hover)]:hover:bg-red-500"
          >
            <FiTrash2 className="shrink-0" aria-hidden />
            Delete
          </button>
          <a
            href={image}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg border border-white/20 bg-white/15 px-3 text-white [@media(hover:hover)]:hover:bg-white/25"
            title="Open image"
          >
            <FiExternalLink aria-hidden />
            <span className="sr-only">Open image</span>
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
