import { NextResponse } from "next/server";
import { getAvailableDates, getDefaultArtist } from "@/services/schedule.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let artistId = searchParams.get("artistId");
    const fromParam = searchParams.get("from");
    const weeksParam = searchParams.get("weeks");

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

    const fromDate = fromParam
      ? new Date(fromParam + "T00:00:00")
      : new Date();
    if (isNaN(fromDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid from date" },
        { status: 400 }
      );
    }
    const weeksAhead = weeksParam ? parseInt(weeksParam, 10) : 4;
    const dates = await getAvailableDates(artistId, fromDate, weeksAhead);
    return NextResponse.json({ success: true, data: dates });
  } catch (error) {
    console.error("AVAILABLE_DATES_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
