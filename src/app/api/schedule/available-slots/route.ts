import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/services/schedule.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const durationStr = searchParams.get("durationMinutes");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Missing date (YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    const durationMinutes = durationStr
      ? parseInt(durationStr, 10)
      : 60;

    const slots = await getAvailableSlots(dateStr, durationMinutes);
    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error("AVAILABLE_SLOTS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
