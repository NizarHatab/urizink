"use client";

import { useEffect, useState } from "react";
import { getReviewStats } from "@/lib/api/reviews";

export default function MonthlyVolume() {
  const [monthlyVolume, setMonthlyVolume] = useState<
    Array<{ month: string; count: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getReviewStats().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        setMonthlyVolume(res.data.monthlyVolume);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-8">Monthly Review Volume</h3>
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  if (monthlyVolume.length === 0) {
    return (
      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-8">Monthly Review Volume</h3>
        <p className="text-gray-500 text-sm">No reviews yet.</p>
      </div>
    );
  }

  const maxCount = Math.max(...monthlyVolume.map((m) => m.count), 1);

  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex flex-col">
      <h3 className="text-lg font-bold mb-8">Monthly Review Volume</h3>

      <div className="flex-1 flex items-end gap-2">
        {monthlyVolume.map((m) => (
          <div
            key={m.month}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full bg-white rounded-t-sm"
              style={{
                height: `${maxCount > 0 ? (m.count / maxCount) * 200 : 0}px`,
              }}
            />
            <span className="text-[10px] text-gray-500 font-bold">
              {m.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
