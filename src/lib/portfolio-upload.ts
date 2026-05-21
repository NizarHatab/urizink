export const PORTFOLIO_MAX_BYTES = 4 * 1024 * 1024;

export const PORTFOLIO_ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const PORTFOLIO_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export function validatePortfolioFile(
  file: File
): { ok: true } | { ok: false; error: string } {
  if (!file.size) {
    return { ok: false, error: "Choose a non-empty image file." };
  }
  if (file.size > PORTFOLIO_MAX_BYTES) {
    return { ok: false, error: "Image must be 4MB or smaller." };
  }
  if (!PORTFOLIO_ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      error: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    };
  }
  return { ok: true };
}

export function mimeToExtension(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "gif";
}

export function parsePortfolioTags(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,#]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function formatPortfolioTags(tags: string[] | null | undefined): string {
  if (!tags?.length) return "";
  return tags.join(", ");
}
