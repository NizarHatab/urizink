"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const SCROLL_THRESHOLD = 48;

/** Matches header bar height so content is not hidden under fixed nav */
export const HEADER_OFFSET_CLASS =
  "pt-20 md:pt-[4.25rem] lg:pt-20";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 border-b bg-black transition-shadow duration-300 ${
          scrolled
            ? "border-neutral-800 shadow-[0_8px_32px_rgba(0,0,0,0.45)] md:border-white/10 md:bg-black/95 md:backdrop-blur-md"
            : "border-neutral-800"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-3 sm:px-5 md:h-[4.25rem] md:px-10 lg:h-20 lg:px-12">
          <Link
            href="/"
            aria-label="UrizInk home"
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3 md:gap-3 lg:gap-4"
          >
            <Image
              src="/images/logo.PNG"
              alt=""
              width={96}
              height={96}
              className="h-14 w-14 shrink-0 object-contain md:h-12 md:w-12 lg:h-[3.5rem] lg:w-[3.5rem] xl:h-16 xl:w-16"
              priority
            />
            <span className="font-display text-[1.75rem] font-black uppercase leading-none tracking-[0.16em] text-white sm:text-[1.85rem] md:text-2xl md:tracking-[0.2em] lg:text-3xl lg:tracking-[0.22em] xl:text-[2rem]">
              UrizInk
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            <NavLink href="/" selectedNav={pathname}>
              Home
            </NavLink>
            <NavLink href="/portfolio" selectedNav={pathname}>
              Portfolio
            </NavLink>
            <NavLink href="/about" selectedNav={pathname}>
              About
            </NavLink>
            <NavLink href="/contact" selectedNav={pathname}>
              Contact
            </NavLink>
            <NavLink href="/reviews" selectedNav={pathname}>
              Reviews
            </NavLink>
          </nav>

          <Link
            href="/book"
            className="hidden h-10 items-center border border-white bg-white px-6 font-bold tracking-wide text-black transition hover:bg-black hover:text-white md:flex"
          >
            Book Now
          </Link>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-700 md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Spacer: keeps hero/content below the fixed bar from first paint */}
      <div className={HEADER_OFFSET_CLASS} aria-hidden />

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
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
        className={`text-xs font-bold uppercase tracking-widest transition-colors ${
          isActive ? "text-white" : "text-neutral-400 hover:text-white"
        }`}
      >
        {children}
      </span>
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute right-0 bottom-0 left-0 h-0.5 bg-white"
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
      className={`fixed inset-0 z-[70] bg-black transition-transform duration-300 ease-out md:hidden ${
        open ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex h-20 items-center justify-between border-b border-neutral-800 px-6">
        <span className="font-display text-sm font-black uppercase tracking-widest text-white">
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
          className="mt-8 border border-white px-10 py-4 font-black uppercase tracking-widest text-white transition hover:bg-white hover:text-black"
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
      className="font-bold uppercase tracking-[0.3em] text-neutral-400 transition hover:text-white"
    >
      {children}
    </Link>
  );
}
