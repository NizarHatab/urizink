import { NextResponse } from "next/server";
import { getReviews } from "@/services/review.service";

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const artistId = searchParams.get("artistId") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const reviews = await getReviews({ artistId, limit });
    return NextResponse.json({
      success: true,
      data: reviews,
      statusCode: 200,
    });
  } catch (error) {
    console.error("REVIEWS_GET_ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reviews",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
