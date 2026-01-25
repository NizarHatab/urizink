function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-transparent text-gray-400 border-gray-700",
    confirmed: "bg-white text-black border-white",
    completed: "bg-gray-800 text-gray-300 border-gray-700",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${map[status]}`}
    >
      {status}
    </span>
  );
}
export default StatusBadge;