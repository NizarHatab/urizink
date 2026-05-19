import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  getBookingById,
  updateBookingStatus,
} from "@/services/booking.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("BOOKING_BY_ID_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const ALLOWED_STATUS = ["confirmed", "cancelled", "completed"] as const;
type StatusAction = (typeof ALLOWED_STATUS)[number];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { id } = await params;
    const body = await req.json();
    const status = body?.status as string | undefined;
    if (!status || !ALLOWED_STATUS.includes(status as StatusAction)) {
      return NextResponse.json(
        {
          error:
            "Invalid body: status must be 'confirmed', 'cancelled', or 'completed'",
        },
        { status: 400 }
      );
    }
    const booking = await updateBookingStatus(id, status as StatusAction);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    if (
      message.includes("Only pending") ||
      message.includes("Only confirmed")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("BOOKING_UPDATE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
