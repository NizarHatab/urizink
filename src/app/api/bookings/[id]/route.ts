import { NextResponse } from "next/server";
import {
  getBookingById,
  updateBookingStatus,
} from "@/services/booking.service";
import { requireAdmin } from "@/lib/auth-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    await requireAdmin(); // Require admin authentication
    const { id } = await params;
    const booking = await getBookingById(id);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found", statusCode: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("BOOKING_BY_ID_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", statusCode: 500 },
      { status: 500 }
    );
  }
}

const statusSchema = { confirmed: "confirmed", cancelled: "cancelled" } as const;
type StatusAction = keyof typeof statusSchema;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(); // Require admin authentication
    const { id } = await params;
    const body = await req.json();
    const status = body?.status as string | undefined;
    if (
      !status ||
      (status !== "confirmed" && status !== "cancelled")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid body: status must be 'confirmed' or 'cancelled'", statusCode: 400 },
        { status: 400 }
      );
    }
    const booking = await updateBookingStatus(id, status as StatusAction);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found", statusCode: 404 },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    const message =
      error instanceof Error ? error.message : "Internal server error";
    if (
      message.includes("Only pending") ||
      message.includes("Only pending or confirmed")
    ) {
      return NextResponse.json(
        { success: false, error: message, statusCode: 400 },
        { status: 400 }
      );
    }
    console.error("BOOKING_UPDATE_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", statusCode: 500 },
      { status: 500 }
    );
  }
}
