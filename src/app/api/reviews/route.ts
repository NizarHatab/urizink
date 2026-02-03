import { NextResponse } from "next/server";
import { getReviews, createReview } from "@/services/review.service";
import type { CreateReviewInput } from "@/services/review.service";

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

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json() as CreateReviewInput;

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.rating) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: firstName, lastName, email, and rating are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Validate rating
    if (typeof body.rating !== "number" || body.rating < 1 || body.rating > 5 || !Number.isInteger(body.rating)) {
      return NextResponse.json(
        {
          success: false,
          error: "Rating must be an integer between 1 and 5",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const review = await createReview(body);
    return NextResponse.json(
      {
        success: true,
        data: review,
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REVIEWS_POST_ERROR:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create review";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
