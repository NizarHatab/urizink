import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  deletePortfolioItem,
  getPortfolioImageUrlById,
} from "@/services/portfolio.service";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const imageUrl = await getPortfolioImageUrlById(id);
    if (!imageUrl) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const removed = await deletePortfolioItem(id);
    if (!removed) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      try {
        await del(imageUrl, { token });
      } catch (e) {
        console.warn("BLOB_DELETE_WARN:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PORTFOLIO_DELETE_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  }
}
