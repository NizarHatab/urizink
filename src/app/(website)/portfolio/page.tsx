import { getPortfolioItems } from "@/services/portfolio.service";
import { listPortfolioCategories } from "@/services/portfolio-category.service";
import type { PortfolioItem } from "@/types/portfolio";
import type { PortfolioCategory } from "@/types/portfolio-category";
import WebsitePortfolio from "./website-portfolio";

export const dynamic = "force-dynamic";

function toPublicItems(
  rows: Awaited<ReturnType<typeof getPortfolioItems>>,
): PortfolioItem[] {
  return rows.map((r) => ({
    id: r.id,
    studioName: r.studioName,
    title: r.title,
    imageUrl: r.imageUrl,
    categoryId: r.categoryId,
    categoryName: r.categoryName,
    style: r.categoryName,
    tags: r.tags,
    createdAt: r.createdAt.toISOString(),
  }));
}

export default async function Page() {
  let initialItems: PortfolioItem[] = [];
  let categories: PortfolioCategory[] = [];

  try {
    const rows = await getPortfolioItems();
    initialItems = toPublicItems(rows);
  } catch (e) {
    console.error("PORTFOLIO_PAGE_LOAD:", e);
  }

  try {
    const rows = await listPortfolioCategories();
    categories = rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sortOrder: c.sortOrder,
    }));
  } catch (e) {
    console.error("PORTFOLIO_CATEGORIES_LOAD:", e);
  }

  return (
    <WebsitePortfolio initialItems={initialItems} categories={categories} />
  );
}
