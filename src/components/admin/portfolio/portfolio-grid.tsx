import type { PortfolioItem } from "@/types/portfolio";
import PortfolioCard from "./portfolio-card";
import PortfolioUploadCard from "./portfolio-upload-card";

type Props = {
  items: PortfolioItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, next: boolean) => void;
  featuredUpdatingId: string | null;
  onOpenUpload: () => void;
};

export default function PortfolioGrid({
  items,
  onEdit,
  onDelete,
  onToggleFeatured,
  featuredUpdatingId,
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
          categoryName={t.categoryName}
          tags={
            t.tags?.length
              ? t.tags
              : t.categoryName
                ? [t.categoryName]
                : ["Portfolio"]
          }
          image={t.imageUrl}
          featuredOnHome={Boolean(t.featuredOnHome)}
          featuredLoading={featuredUpdatingId === t.id}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFeatured={onToggleFeatured}
        />
      ))}

      <PortfolioUploadCard onClick={onOpenUpload} />
    </div>
  );
}
