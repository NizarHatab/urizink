import { db } from "@/db";
import { portfolio } from "@/db/schema/portfolio";
import { coercePortfolioStyleForStorage } from "@/lib/portfolio-styles";
import { getStudioDisplayName } from "@/lib/studio";
import { desc, eq } from "drizzle-orm";

export type PortfolioRow = {
  id: string;
  title: string;
  imageUrl: string;
  style: string | null;
  tags: string[] | null;
  featuredOnHome: boolean;
  homeSortOrder: number;
  createdAt: Date;
  studioName: string;
};

function withStudioName<T extends Omit<PortfolioRow, "studioName">>(
  row: T,
): T & { studioName: string } {
  return { ...row, studioName: getStudioDisplayName() };
}

function mapRow(r: {
  id: string;
  title: string;
  imageUrl: string;
  style: string | null;
  tags: string[] | null;
  featuredOnHome: boolean;
  homeSortOrder: number;
  createdAt: Date;
}): PortfolioRow {
  return withStudioName({
    ...r,
    tags: r.tags ?? null,
  });
}

export async function getPortfolioItems(): Promise<PortfolioRow[]> {
  const rows = await db
    .select({
      id: portfolio.id,
      title: portfolio.title,
      imageUrl: portfolio.imageUrl,
      style: portfolio.style,
      tags: portfolio.tags,
      featuredOnHome: portfolio.featuredOnHome,
      homeSortOrder: portfolio.homeSortOrder,
      createdAt: portfolio.createdAt,
    })
    .from(portfolio)
    .orderBy(desc(portfolio.createdAt));

  return rows.map(mapRow);
}

export async function getHomeFeaturedPortfolioItems(
  limit = 8,
): Promise<PortfolioRow[]> {
  const featured = await db
    .select({
      id: portfolio.id,
      title: portfolio.title,
      imageUrl: portfolio.imageUrl,
      style: portfolio.style,
      tags: portfolio.tags,
      featuredOnHome: portfolio.featuredOnHome,
      homeSortOrder: portfolio.homeSortOrder,
      createdAt: portfolio.createdAt,
    })
    .from(portfolio)
    .where(eq(portfolio.featuredOnHome, true))
    .orderBy(desc(portfolio.homeSortOrder), desc(portfolio.createdAt));

  if (featured.length > 0) {
    return featured.slice(0, limit).map(mapRow);
  }

  const all = await getPortfolioItems();
  return all.slice(0, limit);
}

export async function createPortfolioItem(data: {
  title: string;
  imageUrl: string;
  style?: string | null;
  tags?: string[] | null;
}) {
  const [row] = await db
    .insert(portfolio)
    .values({
      title: data.title,
      imageUrl: data.imageUrl,
      style: coercePortfolioStyleForStorage(data.style),
      tags: data.tags?.length ? data.tags : null,
    })
    .returning();
  return row;
}

export async function updatePortfolioItem(
  id: string,
  data: {
    featuredOnHome?: boolean;
    homeSortOrder?: number;
    style?: string | null;
  },
): Promise<PortfolioRow | null> {
  const patch: Partial<{
    featuredOnHome: boolean;
    homeSortOrder: number;
    style: string | null;
  }> = {};

  if (typeof data.featuredOnHome === "boolean") {
    patch.featuredOnHome = data.featuredOnHome;
  }
  if (typeof data.homeSortOrder === "number") {
    patch.homeSortOrder = data.homeSortOrder;
  }
  if (data.style !== undefined) {
    patch.style = coercePortfolioStyleForStorage(data.style);
  }

  if (Object.keys(patch).length === 0) {
    return getPortfolioRowById(id);
  }

  await db.update(portfolio).set(patch).where(eq(portfolio.id, id));
  return getPortfolioRowById(id);
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const result = await db
    .delete(portfolio)
    .where(eq(portfolio.id, id))
    .returning({ id: portfolio.id });
  return result.length > 0;
}

export async function getPortfolioImageUrlById(
  id: string,
): Promise<string | null> {
  const [row] = await db
    .select({ imageUrl: portfolio.imageUrl })
    .from(portfolio)
    .where(eq(portfolio.id, id));
  return row?.imageUrl ?? null;
}

export async function getPortfolioRowById(
  id: string,
): Promise<PortfolioRow | null> {
  const [row] = await db
    .select({
      id: portfolio.id,
      title: portfolio.title,
      imageUrl: portfolio.imageUrl,
      style: portfolio.style,
      tags: portfolio.tags,
      featuredOnHome: portfolio.featuredOnHome,
      homeSortOrder: portfolio.homeSortOrder,
      createdAt: portfolio.createdAt,
    })
    .from(portfolio)
    .where(eq(portfolio.id, id))
    .limit(1);
  if (!row) return null;
  return mapRow(row);
}
