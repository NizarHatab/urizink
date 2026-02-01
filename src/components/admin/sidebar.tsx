"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  CalendarDays,
  Star,
  ClipboardList,
  Plus,
  LogOut,
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Portfolio", icon: Image, href: "/admin/portfolio" },
  { label: "Bookings", icon: ClipboardList, href: "/admin/bookings" },
  { label: "Schedule", icon: CalendarDays, href: "/admin/schedule" },
  { label: "Reviews", icon: Star, href: "/admin/reviews" },
];

export default function Sidebar({
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-56 flex-col border-r border-[var(--ink-border)] bg-[var(--ink-black)]">
      <div className="flex flex-1 flex-col px-4 py-6">
        {/* Logo */}
        <Link
          href="/admin"
          onClick={onNavigate}
          className="mb-10 flex items-center gap-3"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded border border-white/20 bg-black text-white">
            <span className="text-sm">✒</span>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white">
              UrizInk
            </p>
            <p className="text-[10px] uppercase tracking-widest text-[var(--ink-gray-500)]">
              Admin
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5">
          {nav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-[var(--ink-gray-500)] hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 flex-shrink-0 ${
                    isActive ? "text-white" : "text-[var(--ink-gray-500)]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/admin/bookings"
          onClick={onNavigate}
          className="mt-4 flex items-center justify-center gap-2 rounded-md border-2 border-white py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-black"
        >
          <Plus className="h-4 w-4" />
          New booking
        </Link>

        {/* Log out */}
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            handleLogout();
          }}
          className="mt-4 flex items-center justify-center gap-2 rounded-md border border-white/10 py-2.5 text-xs font-semibold uppercase tracking-widest text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
