import Link from "next/link";
import {
  LayoutDashboard,
  Image,
  CalendarDays,
  Star,
  ClipboardList,
  Settings,
  Plus,
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Portfolio", icon: Image, href: "/admin/portfolio" },
  { label: "Bookings", icon: ClipboardList, href: "/admin/bookings" },
  { label: "Schedule", icon: CalendarDays, href: "/admin/schedule" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
];

export default function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <aside className="w-64 h-full flex flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="p-6 flex flex-col h-full justify-between">
        <div className="space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded">
              <div className="bg-black size-8 flex items-center justify-center rounded-sm">
                ✒️
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold">URIZINK</h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Studio Admin
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-2 h-11 border border-white text-sm font-bold hover:bg-white hover:text-black transition">
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>
    </aside>
  );
}
