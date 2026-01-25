const months = [
  { label: "MAY", value: 30 },
  { label: "JUN", value: 45 },
  { label: "JUL", value: 65 },
  { label: "AUG", value: 95 },
  { label: "SEP", value: 75 },
  { label: "OCT", value: 85 },
];

export default function MonthlyVolume() {
  return (
    <div className="border border-white/10 rounded-xl bg-[#0a0a0a] p-6 flex flex-col">
      <h3 className="text-lg font-bold mb-8">Monthly Review Volume</h3>

      <div className="flex-1 flex items-end gap-2">
        {months.map((m) => (
          <div
            key={m.label}
            className="flex-1 flex flex-col items-center gap-2"
          >
            <div
              className="w-full bg-white rounded-t-sm"
              style={{ height: `${m.value * 2}px` }}
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
