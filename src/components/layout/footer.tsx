"use client";

import { SITE_SOCIAL } from "@/lib/site-links";
import { motion } from "framer-motion";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const socials = [
  {
    href: SITE_SOCIAL.instagram,
    label: "Instagram",
    Icon: FaInstagram,
    hover: "hover:text-[#E4405F] hover:border-[#E4405F]/40",
  },
  {
    href: SITE_SOCIAL.tiktok,
    label: "TikTok",
    Icon: FaTiktok,
    hover: "hover:text-[#00f2ea] hover:border-[#00f2ea]/40",
  },
] as const;

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="w-full border-t border-[var(--ink-border)] px-6 py-10 md:py-12"
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
        <nav
          aria-label="Social media"
          className="flex items-center justify-center gap-5"
        >
          {socials.map(({ href, label, Icon, hover }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Uriz on ${label}`}
              className={`group flex flex-col items-center gap-2 text-[var(--ink-gray-500)] transition-colors ${hover}`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition-all group-hover:scale-105 group-hover:bg-white/[0.08] ${hover}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="font-display text-[10px] uppercase tracking-[0.2em]">
                {label}
              </span>
            </a>
          ))}
        </nav>

        <p className="text-sm uppercase tracking-wider text-[var(--ink-gray-600)]">
          © {new Date().getFullYear()} UrizInk. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}
