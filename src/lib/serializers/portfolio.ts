import type { PortfolioRow } from "@/services/portfolio.service";

export function serializePortfolioItem(row: PortfolioRow) {
  return {
    id: row.id,
    studioName: row.studioName,
    title: row.title,
    imageUrl: row.imageUrl,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    style: row.categoryName,
    tags: row.tags,
    featuredOnHome: row.featuredOnHome,
    homeSortOrder: row.homeSortOrder,
    createdAt: row.createdAt.toISOString(),
  };
}
