"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const selectedNav = pathname;
  return (
    <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
      <div className="flex h-20 items-center justify-between px-3 sm:px-5 md:h-[4.25rem] md:px-10 lg:h-[5.5rem] lg:px-12 xl:h-24">
        <Link
          href="/"
          aria-label="UrizInk home"
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3 lg:gap-4 xl:gap-5"
        >
          <Image
            src="/images/logo.PNG"
            alt=""
            width={96}
            height={96}
            className="h-14 w-14 shrink-0 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-20 xl:w-20 2xl:h-[5.5rem] 2xl:w-[5.5rem]"
            priority
          />
          <span className="font-display text-[1.75rem] font-black uppercase leading-none tracking-[0.16em] text-white sm:text-[1.85rem] md:tracking-[0.2em] lg:text-[2rem] lg:tracking-[0.22em] xl:text-4xl 2xl:text-[2.35rem]">
            UrizInk
          </span>
        </Link>

        {/* DESKTOP NAV */}
        {/* Selected nav have white underline transitioned with framer motion */}
        <nav className="hidden md:flex items-center gap-9 text-sm">
          <NavLink href="/" selectedNav={selectedNav}>Home</NavLink>
          <NavLink href="/portfolio" selectedNav={selectedNav}>Portfolio</NavLink>
          <NavLink href="/about" selectedNav={selectedNav}>About</NavLink>
          <NavLink href="/contact" selectedNav={selectedNav}>Contact</NavLink>
          <NavLink href="/reviews" selectedNav={selectedNav}>Reviews</NavLink>
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
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-700 md:hidden"
        >
          <Menu size={24} />
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
  selectedNav,
}: {
  href: string;
  children: React.ReactNode;
  selectedNav: string;
}) {
  const isActive = selectedNav === href;
  return (
    <Link href={href} className="relative py-3">
      <span
        className={`uppercase tracking-widest text-neutral-400 hover:text-white transition-colors text-xs font-bold ${isActive ? "text-white" : ""}`}
      >
        {children}
      </span>
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
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
      className={`fixed inset-0 z-50 bg-black transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-neutral-800 px-6">
        <span className="font-display text-sm font-black uppercase tracking-widest">
          Menu
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center"
        >
          <X size={26} />
        </button>
      </div>

      <nav className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center gap-10 text-lg">
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
