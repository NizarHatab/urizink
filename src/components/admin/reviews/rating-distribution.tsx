"use client";

import { useEffect, useState } from "react";
import { getReviewStats } from "@/lib/api/reviews";

export default function RatingDistribution() {
  const [ratingDistribution, setRatingDistribution] = useState<
    Array<{ rating: number; count: number; percent: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getReviewStats().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setRatingDistribution(res.data.ratingDistribution);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (ratingDistribution.length === 0) {
    return (
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6">
        <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6">
      <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>

      <div className="space-y-4">
        {ratingDistribution.map((r) => (
          <div key={r.rating} className="flex items-center gap-4">
            <span className="text-xs font-bold w-4 text-gray-400">
              {r.rating}
            </span>

            <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-full"
                style={{ width: `${r.percent}%` }}
              />
            </div>

            <span className="text-xs text-gray-500 w-8 text-right">
              {r.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
