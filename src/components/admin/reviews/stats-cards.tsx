const stats = [
  { label: "Average Score", value: "4.92", sub: "+0.2 from last month" },
  { label: "Total Reviews", value: "1,284", sub: "84 new this week" },
  { label: "Sentiment", value: "98%", sub: "Positive feedback" },
  { label: "Response Rate", value: "100%", sub: "0 pending replies" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((s) => (
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
