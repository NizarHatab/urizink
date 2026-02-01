import { NextResponse } from "next/server";
import { getScheduleForWeek, getDefaultArtist } from "@/services/schedule.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const weekStartParam = searchParams.get("weekStart");
    const artistIdParam = searchParams.get("artistId");

    if (!weekStartParam) {
      return NextResponse.json(
        { error: "Missing weekStart (YYYY-MM-DD, Monday)" },
        { status: 400 }
      );
    }

    const weekStart = new Date(weekStartParam + "T00:00:00");
    if (isNaN(weekStart.getTime())) {
      return NextResponse.json(
        { error: "Invalid weekStart date" },
        { status: 400 }
      );
    }

    // Normalize to Monday
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diff);

    let artistId: string | null = artistIdParam;
    if (!artistId) {
      const defaultArtist = await getDefaultArtist();
      artistId = defaultArtist?.id ?? null;
    }

    const schedule = await getScheduleForWeek(weekStart, artistId);
    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    console.error("SCHEDULE_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
