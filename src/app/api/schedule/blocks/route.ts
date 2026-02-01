import { NextResponse } from "next/server";
import { createBlock } from "@/services/schedule.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { artistId, startTime: startTimeStr, endTime: endTimeStr } = body;

    if (!artistId || !startTimeStr || !endTimeStr) {
      return NextResponse.json(
        { error: "Missing artistId, startTime, or endTime" },
        { status: 400 }
      );
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid startTime or endTime" },
        { status: 400 }
      );
    }

    if (endTime <= startTime) {
      return NextResponse.json(
        { error: "endTime must be after startTime" },
        { status: 400 }
      );
    }

    const block = await createBlock(artistId, startTime, endTime);
    return NextResponse.json({ success: true, data: block });
  } catch (error) {
    console.error("SCHEDULE_BLOCK_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
