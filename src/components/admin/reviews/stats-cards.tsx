import type { ReviewStats } from "@/types/review";

type Props = {
  stats: ReviewStats;
};

export default function StatsCards({ stats }: Props) {
  const avg =
    stats.averageRating !== null ? stats.averageRating.toFixed(2) : "—";
  const positive =
    stats.positivePercent !== null ? `${stats.positivePercent}%` : "—";

  const cards = [
    {
      label: "Average Score",
      value: avg,
      sub:
        stats.totalCount > 0
          ? `From ${stats.totalCount} review${stats.totalCount === 1 ? "" : "s"}`
          : "No reviews yet",
    },
    {
      label: "Total Reviews",
      value: String(stats.totalCount),
      sub:
        stats.newThisWeek > 0
          ? `${stats.newThisWeek} new this week`
          : "No new reviews this week",
    },
    {
      label: "Positive (4–5★)",
      value: positive,
      sub: "Share of 4 and 5 star ratings",
    },
    {
      label: "This week",
      value: String(stats.newThisWeek),
      sub: "Reviews in the last 7 days",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((s) => (
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
