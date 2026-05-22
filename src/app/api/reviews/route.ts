import { NextResponse } from "next/server";
import { getClientIp, normalizeRateLimitKey } from "@/lib/client-ip";
import {
  checkReviewEmailLimits,
  checkReviewIpLimits,
  rateLimitResponse,
} from "@/lib/rate-limit";
import { reviewCreateSchema } from "@/lib/validators/review";
import { createReview, getReviewsPayload } from "@/services/review.service";

export async function GET() {
  try {
    const payload = await getReviewsPayload();
    return NextResponse.json({ success: true, data: payload });
  } catch (error) {
    console.error("REVIEWS_GET_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const ipLimit = await checkReviewIpLimits(ip);
    if (!ipLimit.ok) return rateLimitResponse(ipLimit);

    const body = await req.json();
    const parsed = reviewCreateSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Validation failed" },
        { status: 400 }
      );
    }

    const emailKey = normalizeRateLimitKey(parsed.data.email);
    const emailLimit = await checkReviewEmailLimits(emailKey);
    if (!emailLimit.ok) return rateLimitResponse(emailLimit);

    const review = await createReview(parsed.data);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error("REVIEWS_POST_ERROR:", error);
    if (error instanceof Error && error.message.includes("already submitted")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
