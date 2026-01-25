export default function TimeRow({ time }: { time: string }) {
  return (
    <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-white/5 h-20">
      <div className="flex items-center justify-center border-r border-white/10">
        <span className="text-[10px] font-bold text-gray-500">{time}</span>
      </div>

      {Array.from({ length: 7 }).map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
}

function Cell() {
  return (
    <div className="border-r border-white/5 bg-white/5 hover:bg-white/[0.08] cursor-pointer transition flex items-center justify-center text-gray-500">
      +
    </div>
  );
}
