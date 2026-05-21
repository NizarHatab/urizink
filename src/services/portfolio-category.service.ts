import { db } from "@/db";
import { portfolio } from "@/db/schema/portfolio";
import { portfolioCategories } from "@/db/schema/portfolio-categories";
import { slugifyCategoryName } from "@/lib/slug";
import { count, eq, sql } from "drizzle-orm";

export type PortfolioCategoryRow = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  createdAt: Date;
  pieceCount: number;
};

export async function listPortfolioCategories(): Promise<
  PortfolioCategoryRow[]
> {
  const rows = await db
    .select({
      id: portfolioCategories.id,
      name: portfolioCategories.name,
      slug: portfolioCategories.slug,
      sortOrder: portfolioCategories.sortOrder,
      createdAt: portfolioCategories.createdAt,
      pieceCount: sql<number>`cast(count(${portfolio.id}) as int)`,
    })
    .from(portfolioCategories)
    .leftJoin(portfolio, eq(portfolio.categoryId, portfolioCategories.id))
    .groupBy(
      portfolioCategories.id,
      portfolioCategories.name,
      portfolioCategories.slug,
      portfolioCategories.sortOrder,
      portfolioCategories.createdAt,
    )
    .orderBy(portfolioCategories.sortOrder, portfolioCategories.name);

  return rows.map((r) => ({
    ...r,
    pieceCount: Number(r.pieceCount) || 0,
  }));
}

export async function getPortfolioCategoryById(id: string) {
  const [row] = await db
    .select()
    .from(portfolioCategories)
    .where(eq(portfolioCategories.id, id))
    .limit(1);
  return row ?? null;
}

export async function createPortfolioCategory(name: string) {
  const trimmed = name.trim().slice(0, 80);
  if (!trimmed) throw new Error("Category name is required");

  const slug = slugifyCategoryName(trimmed);
  const [max] = await db
    .select({ m: sql<number>`coalesce(max(${portfolioCategories.sortOrder}), 0)` })
    .from(portfolioCategories);

  const [row] = await db
    .insert(portfolioCategories)
    .values({
      name: trimmed,
      slug,
      sortOrder: (Number(max?.m) || 0) + 1,
    })
    .returning();

  return row;
}

export async function updatePortfolioCategory(
  id: string,
  data: { name?: string; sortOrder?: number },
) {
  const patch: Partial<{ name: string; slug: string; sortOrder: number }> = {};
  if (typeof data.name === "string" && data.name.trim()) {
    patch.name = data.name.trim().slice(0, 80);
    patch.slug = slugifyCategoryName(patch.name);
  }
  if (typeof data.sortOrder === "number") {
    patch.sortOrder = data.sortOrder;
  }

  if (Object.keys(patch).length === 0) {
    return getPortfolioCategoryById(id);
  }

  const [row] = await db
    .update(portfolioCategories)
    .set(patch)
    .where(eq(portfolioCategories.id, id))
    .returning();

  return row ?? null;
}

export async function deletePortfolioCategory(id: string): Promise<boolean> {
  const [row] = await db
    .delete(portfolioCategories)
    .where(eq(portfolioCategories.id, id))
    .returning({ id: portfolioCategories.id });
  return Boolean(row);
}

export async function getCategoryPieceCount(categoryId: string): Promise<number> {
  const [row] = await db
    .select({ c: count() })
    .from(portfolio)
    .where(eq(portfolio.categoryId, categoryId));
  return Number(row?.c ?? 0);
}
