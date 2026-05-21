import { NextResponse } from "next/server";
import { listPortfolioCategories } from "@/services/portfolio-category.service";

export async function GET() {
  try {
    const rows = await listPortfolioCategories();
    return NextResponse.json({
      success: true,
      data: rows.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        sortOrder: c.sortOrder,
      })),
    });
  } catch (error) {
    console.error("PORTFOLIO_CATEGORIES_GET:", error);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}
