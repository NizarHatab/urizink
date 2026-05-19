import type { ReviewMonthlyRow } from "@/types/review";

type Props = {
  monthlyVolume: ReviewMonthlyRow[];
};

export default function MonthlyVolume({ monthlyVolume }: Props) {
  const max = Math.max(1, ...monthlyVolume.map((m) => m.count));

  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex flex-col">
      <h3 className="text-lg font-bold mb-8">Monthly Review Volume</h3>

      <div className="flex-1 flex items-end gap-2 min-h-[120px]">
        {monthlyVolume.map((m) => (
          <div
            key={m.label}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full bg-white rounded-t-sm min-h-[4px]"
              style={{
                height: `${Math.max(4, (m.count / max) * 100)}px`,
              }}
              title={`${m.count} review${m.count === 1 ? "" : "s"}`}
            />
            <span className="text-[10px] text-gray-500 font-bold">
              {m.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
