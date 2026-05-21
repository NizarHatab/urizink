import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  createPortfolioCategory,
  listPortfolioCategories,
} from "@/services/portfolio-category.service";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const rows = await listPortfolioCategories();
    return NextResponse.json({
      success: true,
      data: rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        sortOrder: c.sortOrder,
        pieceCount: c.pieceCount,
      })),
    });
  } catch (error) {
    console.error("ADMIN_CATEGORIES_GET:", error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { name } = body as { name?: string };
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const row = await createPortfolioCategory(name);
    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        slug: row.slug,
        sortOrder: row.sortOrder,
        pieceCount: 0,
      },
    });
  } catch (error) {
    console.error("ADMIN_CATEGORIES_POST:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    if (message.includes("unique") || message.includes("duplicate")) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
