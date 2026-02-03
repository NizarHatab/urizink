"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./review-card";
import { getReviews } from "@/lib/api/reviews";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export default function ReviewsList() {
  const [reviews, setReviews] = useState<Array<{
    name: string;
    rating: number;
    text: string;
    time: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getReviews({ limit: 10 }).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setReviews(
          res.data.map((r) => ({
            name: `${r.firstName} ${r.lastName}`.trim() || "Anonymous",
            rating: r.rating,
            text: r.comment || "No comment provided",
            time: formatRelativeTime(r.createdAt),
          }))
        );
        setError(null);
      } else {
        setError(res.error ?? "Failed to load reviews");
        setReviews([]);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
        </div>
        <p className="text-gray-500 text-sm">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
        </div>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
        </div>
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Recent Customer Reviews</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r, i) => (
          <ReviewCard key={`${r.name}-${i}`} {...r} />
        ))}
      </div>
    </div>
  );
}
