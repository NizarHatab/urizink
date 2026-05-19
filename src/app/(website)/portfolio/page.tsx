import { getPortfolioItems } from "@/services/portfolio.service";
import type { PortfolioItem } from "@/types/portfolio";
import WebsitePortfolio from "./website-portfolio";

export const dynamic = "force-dynamic";

function toPublicItems(
  rows: Awaited<ReturnType<typeof getPortfolioItems>>
): PortfolioItem[] {
  return rows.map((r) => ({
    id: r.id,
    studioName: r.studioName,
    title: r.title,
    imageUrl: r.imageUrl,
    style: r.style,
    tags: r.tags,
    createdAt: r.createdAt.toISOString(),
  }));
}

export default async function Page() {
  let initialItems: PortfolioItem[] = [];
  try {
    const rows = await getPortfolioItems();
    initialItems = toPublicItems(rows);
  } catch (e) {
    console.error("PORTFOLIO_PAGE_LOAD:", e);
  }

  return <WebsitePortfolio initialItems={initialItems} />;
}
