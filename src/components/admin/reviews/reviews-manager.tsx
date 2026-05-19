"use client";

import { deleteReview, fetchReviews } from "@/lib/api/reviews";
import { notify } from "@/lib/ui/toast";
import type { ReviewListItem, ReviewsPayload } from "@/types/review";
import { useCallback, useEffect, useMemo, useState } from "react";
import MonthlyVolume from "./monthly-volume";
import RatingDistribution from "./rating-distribution";
import ReviewsHeader from "./reviews-header";
import ReviewsList from "./reviews-list";
import StatsCards from "./stats-cards";

const emptyStats: ReviewsPayload["stats"] = {
  averageRating: null,
  totalCount: 0,
  newThisWeek: 0,
  positivePercent: null,
  distribution: [5, 4, 3, 2, 1].map((star) => ({ star, count: 0, percent: 0 })),
  monthlyVolume: [],
};

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetchReviews();
    if (!res.success || !res.data) {
      setError(res.error ?? "Failed to load reviews");
      setReviews([]);
      setStats(emptyStats);
    } else {
      setReviews(res.data.reviews);
      setStats(res.data.stats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter(
      (r) =>
        r.authorName.toLowerCase().includes(q) ||
        (r.comment ?? "").toLowerCase().includes(q)
    );
  }, [reviews, search]);

  async function onDelete(id: string) {
    if (!confirm("Remove this review permanently?")) return;
    const res = await deleteReview(id);
    if (!res.success) {
      notify.error(res.error ?? "Delete failed");
      return;
    }
    notify.success("Review removed");
    await load();
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-8 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center text-sm text-gray-500">
        Loading reviews…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ReviewsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={stats.totalCount}
      />
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RatingDistribution
          distribution={stats.distribution}
          totalCount={stats.totalCount}
        />
        <MonthlyVolume monthlyVolume={stats.monthlyVolume} />
      </div>
      <ReviewsList reviews={filtered} onDelete={onDelete} />
    </div>
  );
}
