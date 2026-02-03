import { db } from "@/db";
import { reviews } from "@/db/schema/reviews";
import { users } from "@/db/schema/users";
import { artists } from "@/db/schema/artists";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import type { Review } from "@/types/review";

export interface ReviewWithUser extends Review {
  firstName: string;
  lastName: string;
  artistName: string;
}

export interface ReviewStats {
  averageRating: number | null;
  totalReviews: number;
  ratingDistribution: Array<{ rating: number; count: number; percent: number }>;
  monthlyVolume: Array<{ month: string; count: number }>;
  newReviewsThisWeek: number;
  positiveSentimentPercent: number;
}

export async function getReviews(options?: {
  artistId?: string;
  limit?: number;
}): Promise<ReviewWithUser[]> {
  const selectQuery = db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      artistId: reviews.artistId,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
      artistName: artists.name,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .leftJoin(artists, eq(reviews.artistId, artists.id));

  const rows = options?.artistId
    ? await selectQuery.where(eq(reviews.artistId, options.artistId)).orderBy(desc(reviews.createdAt)).limit(options.limit ?? 100)
    : await selectQuery.orderBy(desc(reviews.createdAt)).limit(options?.limit ?? 100);

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    artistId: row.artistId,
    rating: row.rating,
    comment: row.comment ?? undefined,
    createdAt: row.createdAt.toISOString(),
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    artistName: row.artistName ?? "Unknown Artist",
  }));
}

export async function getReviewStats(): Promise<ReviewStats> {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get all reviews
  const allReviews = await db
    .select({
      rating: reviews.rating,
      createdAt: reviews.createdAt,
    })
    .from(reviews);

  const totalReviews = allReviews.length;

  // Calculate average rating
  const averageRating =
    totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : null;

  // New reviews this week
  const newReviewsThisWeek = allReviews.filter(
    (r) => r.createdAt && new Date(r.createdAt) >= sevenDaysAgo
  ).length;

  // Rating distribution
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  allReviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
    }
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: ratingCounts[rating] || 0,
    percent: totalReviews > 0 ? Math.round((ratingCounts[rating] / totalReviews) * 100) : 0,
  }));

  // Monthly volume (last 6 months)
  const monthlyVolume: Record<string, number> = {};
  const monthLabels: string[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    monthLabels.push(monthKey);
    monthlyVolume[monthKey] = 0;
  }

  allReviews.forEach((r) => {
    if (r.createdAt) {
      const reviewDate = new Date(r.createdAt);
      const monthKey = reviewDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
      if (monthlyVolume[monthKey] !== undefined) {
        monthlyVolume[monthKey]++;
      }
    }
  });

  const monthlyVolumeArray = monthLabels.map((month) => ({
    month,
    count: monthlyVolume[month] || 0,
  }));

  // Positive sentiment (4-5 stars)
  const positiveReviews = allReviews.filter((r) => r.rating >= 4).length;
  const positiveSentimentPercent =
    totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  return {
    averageRating: averageRating !== null ? Math.round(averageRating * 100) / 100 : null,
    totalReviews,
    ratingDistribution,
    monthlyVolume: monthlyVolumeArray,
    newReviewsThisWeek,
    positiveSentimentPercent,
  };
}
