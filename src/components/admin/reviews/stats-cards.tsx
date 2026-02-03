"use client";

import { useEffect, useState } from "react";
import { getReviewStats } from "@/lib/api/reviews";

export default function StatsCards() {
  const [stats, setStats] = useState<{
    averageRating: number | null;
    totalReviews: number;
    newReviewsThisWeek: number;
    positiveSentimentPercent: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getReviewStats().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setStats({
          averageRating: res.data.averageRating,
          totalReviews: res.data.totalReviews,
          newReviewsThisWeek: res.data.newReviewsThisWeek,
          positiveSentimentPercent: res.data.positiveSentimentPercent,
        });
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayStats = [
    {
      label: "Average Score",
      value: loading ? "—" : stats?.averageRating?.toFixed(2) ?? "0.00",
      sub: stats?.averageRating ? "From reviews" : "No reviews yet",
    },
    {
      label: "Total Reviews",
      value: loading ? "—" : stats?.totalReviews.toLocaleString() ?? "0",
      sub: stats?.newReviewsThisWeek
        ? `${stats.newReviewsThisWeek} new this week`
        : "No new reviews",
    },
    {
      label: "Sentiment",
      value: loading ? "—" : `${stats?.positiveSentimentPercent ?? 0}%`,
      sub: "Positive feedback",
    },
    {
      label: "Response Rate",
      value: "100%",
      sub: "0 pending replies",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {displayStats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col gap-1 rounded-xl p-6 border border-white/10 bg-[#0a0a0a]"
        >
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            {s.label}
          </p>
          <p className="text-white text-3xl font-bold">{s.value}</p>
          <p className="text-xs text-gray-500">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
