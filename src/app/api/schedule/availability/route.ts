import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import {
  getWeeklyAvailability,
  setWeeklyAvailability,
} from "@/services/schedule.service";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const availability = await getWeeklyAvailability();
    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error("AVAILABILITY_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { slots } = body as {
      slots: { dayOfWeek: number; startTime: string; endTime: string }[];
    };
    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { error: "Missing slots array" },
        { status: 400 }
      );
    }
    const validated = slots
      .filter(
        (s) =>
          typeof s.dayOfWeek === "number" &&
          s.dayOfWeek >= 0 &&
          s.dayOfWeek <= 6 &&
          typeof s.startTime === "string" &&
          typeof s.endTime === "string"
      )
      .map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }));
    const availability = await setWeeklyAvailability(validated);
    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error("AVAILABILITY_PUT_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
