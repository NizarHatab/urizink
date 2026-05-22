import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/require-admin-api";
import { getReviewStats } from "@/services/review.service";

export async function GET(): Promise<NextResponse> {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const stats = await getReviewStats();
    return NextResponse.json({
      success: true,
      data: stats,
      statusCode: 200,
    });
  } catch (error) {
    console.error("REVIEW_STATS_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch review stats",
        statusCode: 500,
      },
      { status: 500 },
    );
  }
}
