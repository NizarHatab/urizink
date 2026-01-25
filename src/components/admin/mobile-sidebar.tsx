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
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-[#0a0a0a] z-50 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
          <span className="text-sm font-bold">URIZINK</span>
          <button onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <Sidebar mobile onNavigate={() => setOpen(false)} />
      </div>
    </>
  );
}
