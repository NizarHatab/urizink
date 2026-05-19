import type { ReviewDistributionRow } from "@/types/review";

type Props = {
  distribution: ReviewDistributionRow[];
  totalCount: number;
};

export default function RatingDistribution({
  distribution,
  totalCount,
}: Props) {
  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6">
      <h3 className="text-lg font-bold mb-6">Rating Distribution</h3>

      {totalCount === 0 ? (
        <p className="text-sm text-gray-500">No reviews to chart yet.</p>
      ) : (
        <div className="space-y-4">
          {distribution.map((r) => (
            <div key={r.star} className="flex items-center gap-4">
              <span className="text-xs font-bold w-4 text-gray-400">
                {r.star}
              </span>
              <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full"
                  style={{ width: `${r.percent}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {r.percent}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
