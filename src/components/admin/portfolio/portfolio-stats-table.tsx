import { useMemo } from "react";
import type { PortfolioItem } from "@/types/portfolio";

type Props = {
  items: PortfolioItem[];
};

export default function PortfolioStatsTable({ items }: Props) {
  const rows = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of items) {
      const key = i.style?.trim() || "Uncategorized";
      m.set(key, (m.get(key) ?? 0) + 1);
    }
    return Array.from(m.entries())
      .map(([style, count]) => ({ style, count }))
      .sort((a, b) => b.count - a.count);
  }, [items]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Pieces by style</h3>

      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-6 py-4 text-left">Style</th>
              <th className="px-6 py-4 text-right">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.style} className="hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-bold">{row.style}</td>
                <td className="px-6 py-4 text-right tabular-nums">{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
