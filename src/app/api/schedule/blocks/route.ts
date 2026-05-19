import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import { createBlock } from "@/services/schedule.service";

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { startTime: startTimeStr, endTime: endTimeStr } = body;

    if (!startTimeStr || !endTimeStr) {
      return NextResponse.json(
        { error: "Missing startTime or endTime" },
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

    const block = await createBlock(startTime, endTime);
    return NextResponse.json({ success: true, data: block });
  } catch (error) {
    console.error("SCHEDULE_BLOCK_POST_ERROR:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
