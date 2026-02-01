import { NextResponse } from "next/server";
import { getAvailableSlots, getDefaultArtist } from "@/services/schedule.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let artistId = searchParams.get("artistId");
    const dateStr = searchParams.get("date");
    const durationParam = searchParams.get("durationMinutes");

    if (!dateStr) {
      return NextResponse.json(
        { error: "Missing date (YYYY-MM-DD)" },
        { status: 400 }
      );
    }
    if (!artistId) {
      const defaultArtist = await getDefaultArtist();
      artistId = defaultArtist?.id ?? null;
    }
    if (!artistId) {
      return NextResponse.json(
        { error: "No artist found" },
        { status: 404 }
      );
    }

    const durationMinutes = durationParam ? parseInt(durationParam, 10) : 60;
    const slots = await getAvailableSlots(artistId, dateStr, durationMinutes);
    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error("AVAILABLE_SLOTS_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
