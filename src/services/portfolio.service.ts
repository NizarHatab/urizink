import { db } from "@/db";
import { portfolio } from "@/db/schema/portfolio";
import { eq, desc } from "drizzle-orm";
import { getStudioDisplayName } from "@/lib/studio";

export type PortfolioRow = {
  id: string;
  title: string;
  imageUrl: string;
  style: string | null;
  tags: string[] | null;
  createdAt: Date;
  studioName: string;
};

function withStudioName<T extends Omit<PortfolioRow, "studioName">>(
  row: T
): T & { studioName: string } {
  return { ...row, studioName: getStudioDisplayName() };
}

export async function getPortfolioItems(): Promise<PortfolioRow[]> {
  const rows = await db
    .select({
      id: portfolio.id,
      title: portfolio.title,
      imageUrl: portfolio.imageUrl,
      style: portfolio.style,
      tags: portfolio.tags,
      createdAt: portfolio.createdAt,
    })
    .from(portfolio)
    .orderBy(desc(portfolio.createdAt));

  return rows.map((r) =>
    withStudioName({
      ...r,
      tags: r.tags ?? null,
    })
  );
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
      style: data.style?.trim() || null,
      tags: data.tags?.length ? data.tags : null,
    })
    .returning();
  return row;
}

export async function deletePortfolioItem(id: string): Promise<boolean> {
  const result = await db
    .delete(portfolio)
    .where(eq(portfolio.id, id))
    .returning({ id: portfolio.id });
  return result.length > 0;
}

export async function getPortfolioImageUrlById(
  id: string
): Promise<string | null> {
  const [row] = await db
    .select({ imageUrl: portfolio.imageUrl })
    .from(portfolio)
    .where(eq(portfolio.id, id));
  return row?.imageUrl ?? null;
}

export async function getPortfolioRowById(id: string): Promise<PortfolioRow | null> {
  const [row] = await db
    .select({
      id: portfolio.id,
      title: portfolio.title,
      imageUrl: portfolio.imageUrl,
      style: portfolio.style,
      tags: portfolio.tags,
      createdAt: portfolio.createdAt,
    })
    .from(portfolio)
    .where(eq(portfolio.id, id))
    .limit(1);
  if (!row) return null;
  return withStudioName({ ...row, tags: row.tags ?? null });
}
