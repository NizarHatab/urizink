import {
  mimeToExtension,
  PORTFOLIO_ALLOWED_MIME,
  PORTFOLIO_MAX_BYTES,
} from "@/lib/portfolio-upload";

export const BOOKING_REFERENCE_MAX_FILES = 5;
export const BOOKING_REFERENCE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

export function validateBookingReferenceFile(
  file: File
): { ok: true } | { ok: false; error: string } {
  if (!file.size) {
    return { ok: false, error: "One of the selected files is empty." };
  }
  if (file.size > PORTFOLIO_MAX_BYTES) {
    return { ok: false, error: `${file.name || "Image"} must be 4MB or smaller.` };
  }
  if (!PORTFOLIO_ALLOWED_MIME.has(file.type)) {
    return {
      ok: false,
      error: "Only JPEG, PNG, WebP, and GIF reference images are allowed.",
    };
  }
  return { ok: true };
}

export function validateBookingReferenceFiles(
  files: File[]
): { ok: true } | { ok: false; error: string } {
  if (files.length > BOOKING_REFERENCE_MAX_FILES) {
    return {
      ok: false,
      error: `You can attach up to ${BOOKING_REFERENCE_MAX_FILES} reference images.`,
    };
  }
  for (const file of files) {
    const check = validateBookingReferenceFile(file);
    if (!check.ok) return check;
  }
  return { ok: true };
}

export { mimeToExtension, PORTFOLIO_ALLOWED_MIME };
