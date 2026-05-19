import type { PortfolioItem } from "@/types/portfolio";
import PortfolioCard from "./portfolio-card";
import PortfolioUploadCard from "./portfolio-upload-card";

type Props = {
  items: PortfolioItem[];
  onDelete: (id: string) => void;
  onOpenUpload: () => void;
};

export default function PortfolioGrid({
  items,
  onDelete,
  onOpenUpload,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((t) => (
        <PortfolioCard
          key={t.id}
          id={t.id}
          title={t.title}
          studio={t.studioName ?? "UrizInk"}
          tags={
            t.tags?.length
              ? t.tags
              : t.style
                ? [t.style]
                : ["Portfolio"]
          }
          image={t.imageUrl}
          onDelete={onDelete}
        />
      ))}

      <PortfolioUploadCard onClick={onOpenUpload} />
    </div>
  );
}
