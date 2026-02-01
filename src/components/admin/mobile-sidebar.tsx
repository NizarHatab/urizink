"use client";

import { X } from "lucide-react";
import Sidebar from "./sidebar";

export default function MobileSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Overlay */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-56 border-r border-[var(--ink-border)] bg-[var(--ink-black)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-14 items-center justify-end border-b border-[var(--ink-border)] px-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded text-[var(--ink-gray-400)] transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}
