import { ApiResponse } from "@/types/api";
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
}): Promise<ApiResponse<ReviewWithUser[]>> {
  try {
    const params = new URLSearchParams();
    if (options?.artistId) params.set("artistId", options.artistId);
    if (options?.limit) params.set("limit", String(options.limit));

    const response = await fetch(`/api/reviews?${params}`);
    const json: ApiResponse<ReviewWithUser[]> = await response.json();
    if (!response.ok || !json.success) {
      return {
        success: false,
        error: json.error ?? "Failed to fetch reviews",
      };
    }
    return json;
  } catch (error) {
    console.error("REVIEWS_GET_ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch reviews",
    };
  }
}

export async function getReviewStats(): Promise<ApiResponse<ReviewStats>> {
  try {
    const response = await fetch("/api/reviews/stats");
    const json: ApiResponse<ReviewStats> = await response.json();
    if (!response.ok || !json.success) {
      return {
        success: false,
        error: json.error ?? "Failed to fetch review stats",
      };
    }
    return json;
  } catch (error) {
    console.error("REVIEW_STATS_ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch review stats",
    };
  }
}

export interface CreateReviewInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  rating: number;
  comment?: string;
  artistId?: string;
}

export async function createReview(
  data: CreateReviewInput
): Promise<ApiResponse<Review>> {
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json: ApiResponse<Review> = await response.json();
    if (!response.ok || !json.success) {
      return {
        success: false,
        error: json.error ?? "Failed to create review",
      };
    }
    return json;
  } catch (error) {
    console.error("REVIEW_CREATE_ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create review",
    };
  }
}
