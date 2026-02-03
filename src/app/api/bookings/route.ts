// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createBooking, getBookings } from "@/services/booking.service";
import { bookingCreateSchema } from "@/lib/validators/booking";
import { ApiResponse, Booking, BookingCreateInput } from "@/types";
import { requireAdmin } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const body = await req.json() as BookingCreateInput;
    const parsed = bookingCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", statusCode: 400 },
        { status: 400 }
      );
    }
    const booking = await createBooking(parsed.data);
    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Failed to create booking", statusCode: 500 },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, data: booking, statusCode: 201 },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: "Validation failed", statusCode: 400 },
        { status: 400 }
      );
    }

    console.error("BOOKING_ERROR:", error);

    return NextResponse.json(
      { success: false, error: "Internal server error", statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await requireAdmin(); // Require admin authentication
    const bookings = await getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("BOOKINGS_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error", statusCode: 500 },
      { status: 500 }
    );
  }
}