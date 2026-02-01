import { NextResponse } from "next/server";
import {
  getBookingById,
  updateBookingStatus,
} from "@/services/booking.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

const statusSchema = { confirmed: "confirmed", cancelled: "cancelled" } as const;
type StatusAction = keyof typeof statusSchema;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const status = body?.status as string | undefined;
    if (
      !status ||
      (status !== "confirmed" && status !== "cancelled")
    ) {
      return NextResponse.json(
        { error: "Invalid body: status must be 'confirmed' or 'cancelled'" },
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
      message.includes("Only pending or confirmed")
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
