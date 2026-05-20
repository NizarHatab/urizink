import HomePage from "@/components/sections/home-page";
import { getPublishedStudioIntro } from "@/services/home-content.service";
import { getHomeFeaturedPortfolioItems } from "@/services/portfolio.service";
import { getReviewsPayload } from "@/services/review.service";
import type { PortfolioItem } from "@/types/portfolio";
import type { ReviewListItem, ReviewStats } from "@/types/review";

export const dynamic = "force-dynamic";

const emptyStats: ReviewStats = {
  averageRating: null,
  totalCount: 0,
  newThisWeek: 0,
  positivePercent: null,
  distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percent: 0 })),
  monthlyVolume: [],
};

function toPortfolioItem(
  row: Awaited<ReturnType<typeof getHomeFeaturedPortfolioItems>>[number],
): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    style: row.style,
    tags: row.tags,
    featuredOnHome: row.featuredOnHome,
    homeSortOrder: row.homeSortOrder,
    createdAt: row.createdAt.toISOString(),
    studioName: row.studioName,
  };
}

export default async function Page() {
  let portfolioPreview: PortfolioItem[] = [];
  let latestReviews: ReviewListItem[] = [];
  let reviewStats: ReviewStats = emptyStats;
  let artistIntro: { heading: string; body: string } | null = null;

  try {
    artistIntro = await getPublishedStudioIntro();
  } catch (e) {
    console.error("HOME_INTRO:", e);
  }

  try {
    const rows = await getHomeFeaturedPortfolioItems(8);
    portfolioPreview = rows.map(toPortfolioItem);
  } catch (e) {
    console.error("HOME_PORTFOLIO_PREVIEW:", e);
  }

  try {
    const payload = await getReviewsPayload();
    latestReviews = payload.reviews.slice(0, 3);
    reviewStats = payload.stats;
  } catch (e) {
    console.error("HOME_REVIEWS_PREVIEW:", e);
  }

  return (
    <HomePage
      artistIntro={artistIntro}
      portfolioPreview={portfolioPreview}
      latestReviews={latestReviews}
      reviewStats={reviewStats}
    />
  );
}
