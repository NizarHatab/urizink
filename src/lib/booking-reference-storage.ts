import { put } from "@vercel/blob";
import { validateBookingReferenceFiles } from "@/lib/booking-reference-upload";
import {
  mimeToExtension,
  PORTFOLIO_ALLOWED_MIME,
  PORTFOLIO_MAX_BYTES,
} from "@/lib/portfolio-upload";

export async function uploadBookingReferenceImages(
  bookingId: string,
  files: File[]
): Promise<string[]> {
  const check = validateBookingReferenceFiles(files);
  if (!check.ok) {
    throw new Error(check.error);
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "Reference image uploads are not configured. Add BLOB_READ_WRITE_TOKEN in Vercel."
    );
  }

  const urls: string[] = [];

  for (const file of files) {
    if (!PORTFOLIO_ALLOWED_MIME.has(file.type) || file.size > PORTFOLIO_MAX_BYTES) {
      continue;
    }
    const ext = mimeToExtension(file.type);
    const pathname = `bookings/${bookingId}/reference-${crypto.randomUUID()}.${ext}`;
    const blob = await put(pathname, file, {
      access: "public",
      token,
      contentType: file.type,
    });
    urls.push(blob.url);
  }

  return urls;
}
