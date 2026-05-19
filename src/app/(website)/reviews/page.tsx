import { getReviewsPayload } from "@/services/review.service";
import type { ReviewsPayload } from "@/types/review";
import WebsiteReviews from "./website-reviews";

export const dynamic = "force-dynamic";

const emptyPayload: ReviewsPayload = {
  reviews: [],
  stats: {
    averageRating: null,
    totalCount: 0,
    newThisWeek: 0,
    positivePercent: null,
    distribution: [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: 0,
      percent: 0,
    })),
    monthlyVolume: [],
  },
};

export default async function Page() {
  let initial = emptyPayload;
  try {
    initial = await getReviewsPayload();
  } catch (e) {
    console.error("REVIEWS_PAGE_LOAD:", e);
  }

  return <WebsiteReviews initial={initial} />;
}
