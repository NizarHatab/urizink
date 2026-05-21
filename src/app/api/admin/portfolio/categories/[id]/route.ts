import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  deletePortfolioCategory,
  getCategoryPieceCount,
  updatePortfolioCategory,
} from "@/services/portfolio-category.service";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, sortOrder } = body as {
      name?: string;
      sortOrder?: number;
    };

    const row = await updatePortfolioCategory(id, { name, sortOrder });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const pieceCount = await getCategoryPieceCount(id);
    return NextResponse.json({
      success: true,
      data: {
        id: row.id,
        name: row.name,
        slug: row.slug,
        sortOrder: row.sortOrder,
        pieceCount,
      },
    });
  } catch (error) {
    console.error("ADMIN_CATEGORY_PATCH:", error);
    const message =
      error instanceof Error ? error.message : "Failed to update category";
    if (message.includes("unique") || message.includes("duplicate")) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const removed = await deletePortfolioCategory(id);
    if (!removed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADMIN_CATEGORY_DELETE:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
