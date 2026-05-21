import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  mimeToExtension,
  parsePortfolioTags,
  PORTFOLIO_ALLOWED_MIME,
  PORTFOLIO_MAX_BYTES,
} from "@/lib/portfolio-upload";
import { serializePortfolioItem } from "@/lib/serializers/portfolio";
import { getPortfolioCategoryById } from "@/services/portfolio-category.service";
import {
  deletePortfolioItem,
  getPortfolioImageUrlById,
  getPortfolioRowById,
  updatePortfolioItem,
} from "@/services/portfolio.service";

async function resolveCategoryId(
  raw: FormDataEntryValue | string | null | undefined,
): Promise<{ ok: true; id: string | null } | { ok: false; response: NextResponse }> {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, id: null };
  }
  const id = typeof raw === "string" ? raw.trim() : String(raw).trim();
  if (!id) return { ok: true, id: null };
  const cat = await getPortfolioCategoryById(id);
  if (!cat) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid category" }, { status: 400 }),
    };
  }
  return { ok: true, id: cat.id };
}

async function uploadReplacementImage(
  file: Blob,
  token: string,
): Promise<{ ok: true; url: string } | { ok: false; response: NextResponse }> {
  if (file.size === 0) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Image file is empty" }, { status: 400 }),
    };
  }
  if (file.size > PORTFOLIO_MAX_BYTES) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Image must be 4MB or smaller" },
        { status: 400 },
      ),
    };
  }
  const mime = file.type;
  if (!PORTFOLIO_ALLOWED_MIME.has(mime)) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 },
      ),
    };
  }
  const pathname = `portfolio/${crypto.randomUUID()}.${mimeToExtension(mime)}`;
  const blob = await put(pathname, file, {
    access: "public",
    token,
    contentType: mime,
  });
  return { ok: true, url: blob.url };
}

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

  const existing = await getPortfolioRowById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";
    const patch: Parameters<typeof updatePortfolioItem>[1] = {};
    let oldImageUrl: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const title = form.get("title");
      const categoryId = form.get("categoryId");
      const tagsRaw = form.get("tags");
      const featuredRaw = form.get("featuredOnHome");
      const file = form.get("file");

      if (form.has("title")) {
        if (typeof title !== "string" || !title.trim()) {
          return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }
        patch.title = title.trim().slice(0, 150);
      }

      if (form.has("categoryId")) {
        const catRes = await resolveCategoryId(categoryId);
        if (!catRes.ok) return catRes.response;
        patch.categoryId = catRes.id;
      }

      if (form.has("tags")) {
        const tags = parsePortfolioTags(
          typeof tagsRaw === "string" ? tagsRaw : "",
        );
        patch.tags = tags.length ? tags : null;
      }

      if (form.has("featuredOnHome")) {
        patch.featuredOnHome = featuredRaw === "true";
      }

      if (file instanceof Blob && file.size > 0) {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
          return NextResponse.json(
            {
              error:
                "File uploads are not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.",
            },
            { status: 503 },
          );
        }
        const uploaded = await uploadReplacementImage(file, token);
        if (!uploaded.ok) return uploaded.response;
        oldImageUrl = existing.imageUrl;
        patch.imageUrl = uploaded.url;
      }
    } else {
      const body = await req.json();
      const {
        featuredOnHome,
        homeSortOrder,
        categoryId,
        title,
        tags,
      } = body as {
        featuredOnHome?: boolean;
        homeSortOrder?: number;
        categoryId?: string | null;
        title?: string;
        tags?: string[] | string | null;
      };

      if (typeof title === "string" && title.trim()) {
        patch.title = title.trim().slice(0, 150);
      }
      if (categoryId !== undefined) {
        if (categoryId === null || categoryId === "") {
          patch.categoryId = null;
        } else {
          const cat = await getPortfolioCategoryById(String(categoryId).trim());
          if (!cat) {
            return NextResponse.json(
              { error: "Invalid category" },
              { status: 400 },
            );
          }
          patch.categoryId = cat.id;
        }
      }
      if (tags !== undefined) {
        if (tags === null) {
          patch.tags = null;
        } else if (Array.isArray(tags)) {
          patch.tags = tags
            .map((t) => String(t).trim())
            .filter(Boolean)
            .slice(0, 20);
        } else if (typeof tags === "string") {
          const parsed = parsePortfolioTags(tags);
          patch.tags = parsed.length ? parsed : null;
        }
      }
      if (typeof featuredOnHome === "boolean") {
        patch.featuredOnHome = featuredOnHome;
      }
      if (typeof homeSortOrder === "number") {
        patch.homeSortOrder = homeSortOrder;
      }
    }

    const updated = await updatePortfolioItem(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (oldImageUrl) {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (token) {
        try {
          await del(oldImageUrl, { token });
        } catch (e) {
          console.warn("BLOB_DELETE_WARN:", e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: serializePortfolioItem(updated),
    });
  } catch (error) {
    console.error("PORTFOLIO_PATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 },
    );
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
      { status: 500 },
    );
  }
}
