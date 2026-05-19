import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import { getScheduleForWeek } from "@/services/schedule.service";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const weekStartParam = searchParams.get("weekStart");

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

    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diff);

    const schedule = await getScheduleForWeek(weekStart);
    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    console.error("SCHEDULE_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
