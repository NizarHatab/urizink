import { FiEdit2, FiExternalLink, FiHome, FiTrash2 } from "react-icons/fi";

type Props = {
  id: string;
  title: string;
  studio: string;
  categoryName?: string | null;
  tags: string[];
  image: string;
  featuredOnHome: boolean;
  featuredLoading?: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, next: boolean) => void;
};

export default function PortfolioCard({
  id,
  title,
  studio,
  tags,
  image,
  featuredOnHome,
  categoryName,
  featuredLoading,
  onEdit,
  onDelete,
  onToggleFeatured,
}: Props) {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl border bg-[#0a0a0a] transition ${
        featuredOnHome ? "border-white/40" : "border-white/20 hover:border-white/50"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--ink-gray-900)]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={title}
        />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap gap-2 bg-gradient-to-t from-black via-black/95 to-transparent p-3 pt-12">
          <button
            type="button"
            onClick={() => onEdit(id)}
            title="Edit piece"
            className="flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg border border-white/20 bg-white/15 px-3 text-white [@media(hover:hover)]:hover:bg-white/25"
          >
            <FiEdit2 className="shrink-0" aria-hidden />
            <span className="sr-only">Edit</span>
          </button>
          <button
            type="button"
            disabled={featuredLoading}
            onClick={() => onToggleFeatured(id, !featuredOnHome)}
            title={
              featuredOnHome
                ? "Remove from home page"
                : "Show on home page"
            }
            className={`flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-lg border px-3 transition disabled:opacity-50 ${
              featuredOnHome
                ? "border-white bg-white text-black"
                : "border-white/20 bg-white/15 text-white [@media(hover:hover)]:hover:bg-white/25"
            }`}
          >
            <FiHome className="shrink-0" aria-hidden />
            <span className="sr-only">
              {featuredOnHome ? "On home page" : "Add to home page"}
            </span>
          </button>
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

      <div className="border-t border-white/10 p-4">
        <h4 className="mb-1 truncate text-sm font-bold">{title}</h4>
        <p className="text-xs text-gray-500">
          {categoryName ? categoryName : studio}
        </p>
        {featuredOnHome ? (
          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-white/80">
            Featured on home
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
