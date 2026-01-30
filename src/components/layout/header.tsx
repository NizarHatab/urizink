"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
// use app router instead 
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="flex items-center justify-between px-5 md:px-10 h-16">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center">
            🖤
          </div>
          <span className="text-lg font-black tracking-widest uppercase">
            UrizInk
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-9 text-sm">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/portfolio">Portfolio</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/reviews">Reviews</NavLink>
        </nav>

        {/* CTA */}
        <Link
          href="/book"
          className="hidden md:flex border border-white bg-white text-black h-10 px-6 items-center font-bold tracking-wide hover:bg-black hover:text-white transition"
        >
          Book Now
        </Link>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 border border-neutral-700"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="uppercase tracking-widest text-neutral-400 hover:text-white transition text-xs font-bold"
    >
      {children}
    </Link>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-neutral-800">
        <span className="uppercase tracking-widest font-black">Menu</span>
        <button onClick={onClose}>
          <X size={26} />
        </button>
      </div>

      <nav className="flex flex-col items-center justify-center gap-10 h-[calc(100vh-64px)] text-lg">
        <MobileNavLink href="/" onClick={onClose}>
          Home
        </MobileNavLink>
        <MobileNavLink href="/portfolio" onClick={onClose}>
          Portfolio
        </MobileNavLink>
        <MobileNavLink href="/about" onClick={onClose}>
          About
        </MobileNavLink>
        <MobileNavLink href="/contact" onClick={onClose}>
          Contact
        </MobileNavLink>
        <MobileNavLink href="/reviews" onClick={onClose}>
          Reviews
        </MobileNavLink>

        <Link
          href="/book"
          onClick={onClose}
          className="mt-8 border border-white px-10 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-black transition"
        >
          Book Now
        </Link>
      </nav>
    </div>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="uppercase tracking-[0.3em] font-bold text-neutral-400 hover:text-white transition"
    >
      {children}
    </Link>
  );
}
