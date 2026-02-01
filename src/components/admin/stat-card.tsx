import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
}

export default function StatCard({
  label,
  value,
  delta,
  icon: Icon,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--ink-border)] bg-[var(--ink-black)] transition-colors hover:border-[var(--ink-gray-700)]">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-gray-500)]">
              {label}
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white tabular-nums">
              {value}
            </p>
            {delta && (
              <p className="mt-1.5 text-xs font-medium text-[var(--ink-gray-400)]">
                {delta}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-[var(--ink-gray-500)] transition-colors group-hover:bg-white/10 group-hover:text-white">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
