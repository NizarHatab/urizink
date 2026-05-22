import { db } from "@/db";
import { reviews } from "@/db/schema/reviews";
import { users } from "@/db/schema/users";
import { desc, eq } from "drizzle-orm";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { ReviewCreateInput } from "@/lib/validators/review";
import type {
  ReviewListItem,
  ReviewStats,
  ReviewsPayload,
} from "@/types/review";
import { notifyNewReview } from "@/lib/notifications/notify-studio";
import { findOrCreateUserByEmail } from "./user.service";

function authorName(firstName: string | null, lastName: string | null): string {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || "Client";
}

function computeStats(
  rows: { rating: number; createdAt: Date }[]
): ReviewStats {
  const totalCount = rows.length;
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const averageRating =
    totalCount > 0
      ? Math.round(
          (rows.reduce((s, r) => s + r.rating, 0) / totalCount) * 100
        ) / 100
      : null;

  const newThisWeek = rows.filter((r) => r.createdAt >= weekAgo).length;

  const positiveCount = rows.filter((r) => r.rating >= 4).length;
  const positivePercent =
    totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : null;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = rows.filter((r) => r.rating === star).length;
    const percent =
      totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { star, count, percent };
  });

  const monthlyVolume: ReviewStats["monthlyVolume"] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = rows.filter(
      (r) => r.createdAt >= d && r.createdAt < next
    ).length;
    monthlyVolume.push({
      label: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
      count,
    });
  }

  return {
    averageRating,
    totalCount,
    newThisWeek,
    positivePercent,
    distribution,
    monthlyVolume,
  };
}

export async function getReviewsPayload(): Promise<ReviewsPayload> {
  const rows = await db
    .select({
      id: reviews.id,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .orderBy(desc(reviews.createdAt));

  const reviewList: ReviewListItem[] = rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    authorName: authorName(row.firstName, row.lastName),
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
    timeAgo: formatRelativeTime(row.createdAt),
  }));

  const stats = computeStats(
    rows.map((r) => ({ rating: r.rating, createdAt: r.createdAt }))
  );

  return { reviews: reviewList, stats };
}

export async function getReviewStats(): Promise<ReviewStats> {
  const rows = await db
    .select({
      rating: reviews.rating,
      createdAt: reviews.createdAt,
    })
    .from(reviews);

  return computeStats(rows);
}

export async function createReview(
  data: ReviewCreateInput
): Promise<ReviewListItem> {
  const user = await findOrCreateUserByEmail({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  });

  const [existing] = await db
    .select({ id: reviews.id })
    .from(reviews)
    .where(eq(reviews.userId, user.id))
    .limit(1);

  if (existing) {
    throw new Error("You have already submitted a review with this email.");
  }

  const [row] = await db
    .insert(reviews)
    .values({
      userId: user.id,
      rating: data.rating,
      comment: data.comment.trim(),
    })
    .returning();

  if (!row) throw new Error("Failed to create review");

  notifyNewReview({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    rating: data.rating,
    comment: data.comment,
    reviewId: row.id,
  });

  return {
    id: row.id,
    userId: row.userId,
    authorName: authorName(user.firstName, user.lastName),
    rating: row.rating,
    comment: row.comment,
    createdAt: row.createdAt.toISOString(),
    timeAgo: formatRelativeTime(row.createdAt),
  };
}

export async function deleteReview(id: string): Promise<boolean> {
  const result = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning({ id: reviews.id });
  return result.length > 0;
}
