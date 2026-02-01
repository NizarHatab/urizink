"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";
import MobileSidebar from "./mobile-sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-black">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-56 lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar open={open} setOpen={setOpen} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <header className="flex h-14 items-center justify-between border-b border-[var(--ink-border)] bg-[var(--ink-black)] px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded text-white transition-colors hover:bg-white/5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            UrizInk
          </span>
          <div className="w-9" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
