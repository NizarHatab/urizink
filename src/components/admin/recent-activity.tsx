import {
  FiFileText,
  FiCheckCircle,
  FiCreditCard,
  FiStar,
  FiMoreHorizontal,
} from "react-icons/fi";

const activity = [
  {
    icon: FiFileText,
    text: "M. Rossi booked a Full Sleeve project",
    time: "2 minutes ago",
  },
  {
    icon: FiCheckCircle,
    text: "Julia Thorne completed session",
    time: "1 hour ago",
  },
  {
    icon: FiCreditCard,
    text: "Deposit received from Leon Black",
    time: "3 hours ago",
  },
  {
    icon: FiStar,
    text: "David W. left a 5-star review",
    time: "Yesterday",
  },
];

export default function RecentActivity() {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          Recent Activity
        </h3>
        <button className="text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-white border-b border-gray-800 hover:border-white transition">
          View All History
        </button>
      </div>

      <div className="border border-white/10 rounded-xl bg-[#0a0a0a] overflow-hidden divide-y divide-white/5">
        {activity.map((a, i) => (
          <div
            key={i}
            className="p-5 flex items-center gap-4 hover:bg-white/2 transition"
          >
            <div className="size-10 rounded bg-white/5 flex items-center justify-center border border-white/10">
              <a.icon className="text-lg" />
            </div>

            <div className="flex-1">
              <p className="text-sm">{a.text}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {a.time}
              </p>
            </div>

            <FiMoreHorizontal className="text-gray-600 hover:text-white cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
}
