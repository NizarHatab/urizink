import { NextResponse } from "next/server";
import { getAvailableDates } from "@/services/schedule.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromStr = searchParams.get("from");
    const weeksStr = searchParams.get("weeks");
    const weeksAhead = weeksStr ? parseInt(weeksStr, 10) : 4;
    const durationStr = searchParams.get("durationMinutes");
    const durationMinutes = durationStr
      ? parseInt(durationStr, 10)
      : 60;

    const fromDate = fromStr ? new Date(fromStr + "T00:00:00") : new Date();
    if (isNaN(fromDate.getTime())) {
      return NextResponse.json({ error: "Invalid from date" }, { status: 400 });
    }

    const dates = await getAvailableDates(
      fromDate,
      weeksAhead,
      Number.isFinite(durationMinutes) && durationMinutes > 0
        ? durationMinutes
        : 60
    );
    return NextResponse.json({ success: true, data: dates });
  } catch (error) {
    console.error("AVAILABLE_DATES_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
