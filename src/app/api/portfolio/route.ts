import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import { coercePortfolioStyleForStorage } from "@/lib/portfolio-styles";
import {
  mimeToExtension,
  PORTFOLIO_ALLOWED_MIME,
  PORTFOLIO_MAX_BYTES,
} from "@/lib/portfolio-upload";
import {
  createPortfolioItem,
  getPortfolioItems,
  getPortfolioRowById,
} from "@/services/portfolio.service";

function parseTags(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,#]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export async function GET() {
  try {
    const rows = await getPortfolioItems();
    return NextResponse.json({
      success: true,
      data: rows.map((r) => ({
        id: r.id,
        studioName: r.studioName,
        title: r.title,
        imageUrl: r.imageUrl,
        style: r.style,
        tags: r.tags,
        featuredOnHome: r.featuredOnHome,
        homeSortOrder: r.homeSortOrder,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("PORTFOLIO_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error:
          "File uploads are not configured. Add BLOB_READ_WRITE_TOKEN in Vercel → Storage → Blob, then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    const title = form.get("title");
    const style = form.get("style");
    const tagsRaw = form.get("tags");

    if (!(file instanceof Blob) || file.size === 0) {
      return NextResponse.json(
        { error: "A non-empty image file is required" },
        { status: 400 }
      );
    }
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (file.size > PORTFOLIO_MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 4MB or smaller" },
        { status: 400 }
      );
    }

    const mime = file.type;
    if (!PORTFOLIO_ALLOWED_MIME.has(mime)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    const pathname = `portfolio/${crypto.randomUUID()}.${mimeToExtension(mime)}`;

    const blob = await put(pathname, file, {
      access: "public",
      token,
      contentType: mime,
    });

    const tags = parseTags(typeof tagsRaw === "string" ? tagsRaw : null);
    const row = await createPortfolioItem({
      title: title.trim().slice(0, 150),
      imageUrl: blob.url,
      style:
        typeof style === "string"
          ? coercePortfolioStyleForStorage(style)
          : null,
      tags: tags.length ? tags : null,
    });

    const full = await getPortfolioRowById(row.id);
    if (!full) {
      return NextResponse.json(
        { error: "Created but failed to load item" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: full.id,
        studioName: full.studioName,
        title: full.title,
        imageUrl: full.imageUrl,
        style: full.style,
        tags: full.tags,
        featuredOnHome: full.featuredOnHome,
        homeSortOrder: full.homeSortOrder,
        createdAt: full.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("PORTFOLIO_POST_ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create portfolio item";
    if (message.includes("private store") || message.includes("public store")) {
      return NextResponse.json(
        {
          error:
            "Blob store access does not match the app. Use a Public Vercel Blob store (urizink-blob) with access: public in code.",
        },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
