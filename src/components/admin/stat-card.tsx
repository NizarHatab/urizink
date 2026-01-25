import { IconType } from "react-icons";

interface Props {
  label: string;
  value: string;
  delta?: string;
  icon: IconType;
}

export default function StatCard({
  label,
  value,
  delta,
  icon: Icon,
}: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl p-6 border border-white/10 bg-[#0a0a0a] hover:border-white/30 transition">
      <div className="flex justify-between items-start">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
          {label}
        </p>
        <Icon className="text-gray-600 text-xl" />
      </div>

      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-white text-3xl font-bold tracking-tight">
          {value}
        </p>
        {delta && (
          <p className="text-gray-400 text-xs font-bold">
            {delta}
          </p>
        )}
      </div>
    </div>
  );
}
