import type { ApiResponse } from "@/types/api";
import type { ReviewListItem, ReviewsPayload } from "@/types/review";
import type { ReviewCreateInput } from "@/lib/validators/review";

export async function fetchReviews(): Promise<ApiResponse<ReviewsPayload>> {
  try {
    const res = await fetch("/api/reviews", { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: (json as { error?: string }).error ?? "Failed to load reviews",
      };
    }
    return { success: true, data: json.data as ReviewsPayload };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to load reviews",
    };
  }
}

export async function submitReview(
  body: ReviewCreateInput
): Promise<ApiResponse<ReviewListItem>> {
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: (json as { error?: string }).error ?? "Failed to submit review",
      };
    }
    return { success: true, data: (json as { data: ReviewListItem }).data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to submit review",
    };
  }
}

export async function deleteReview(id: string): Promise<ApiResponse<void>> {
  try {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) {
        return {
          success: false,
          error: "Please log in again at /admin/login.",
        };
      }
      return {
        success: false,
        error: (json as { error?: string }).error ?? "Delete failed",
      };
    }
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Delete failed",
    };
  }
}
