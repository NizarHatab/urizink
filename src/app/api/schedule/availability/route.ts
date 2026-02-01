import { NextResponse } from "next/server";
import {
  getWeeklyAvailability,
  setWeeklyAvailability,
  getDefaultArtist,
} from "@/services/schedule.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let artistId = searchParams.get("artistId");
    if (!artistId) {
      const defaultArtist = await getDefaultArtist();
      artistId = defaultArtist?.id ?? null;
    }
    if (!artistId) {
      return NextResponse.json(
        { error: "No artist found. Add an artist first." },
        { status: 404 }
      );
    }
    const availability = await getWeeklyAvailability(artistId);
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
  try {
    const body = await req.json();
    const { artistId, slots } = body as {
      artistId: string;
      slots: { dayOfWeek: number; startTime: string; endTime: string }[];
    };
    if (!artistId || !Array.isArray(slots)) {
      return NextResponse.json(
        { error: "Missing artistId or slots array" },
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
    const availability = await setWeeklyAvailability(artistId, validated);
    return NextResponse.json({ success: true, data: availability });
  } catch (error) {
    console.error("AVAILABILITY_PUT_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
