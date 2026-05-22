import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getClientIp, normalizeRateLimitKey } from "@/lib/client-ip";
import { parseBookingMultipart } from "@/lib/parse-booking-form";
import {
  checkBookingEmailLimits,
  checkBookingIpLimits,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { requireAdminApi } from "@/lib/require-admin-api";
import { createBooking, getBookings } from "@/services/booking.service";
import { bookingCreateSchema } from "@/lib/validators/booking";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = await checkBookingIpLimits(ip);
    if (!ipLimit.ok) return rateLimitResponse(ipLimit);

    const contentType = req.headers.get("content-type") ?? "";
    let files: File[] = [];
    let body: unknown;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const parsed = parseBookingMultipart(form);
      body = parsed.data;
      files = parsed.files;
    } else {
      body = await req.json();
    }

    const validated = bookingCreateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validated.error.issues },
        { status: 400 }
      );
    }

    const emailKey = normalizeRateLimitKey(validated.data.email);
    const emailLimit = await checkBookingEmailLimits(emailKey);
    if (!emailLimit.ok) return rateLimitResponse(emailLimit);

    const booking = await createBooking(validated.data, files);

    return NextResponse.json(
      {
        success: true,
        booking: {
          ...booking,
          scheduledAt: booking.scheduledAt?.toISOString(),
          createdAt: booking.createdAt.toISOString(),
          referenceImageUrls: booking.referenceImageUrls ?? [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }

    console.error("BOOKING_ERROR:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create booking";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("BOOKINGS_ERROR:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
