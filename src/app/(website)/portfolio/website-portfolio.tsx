"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/types/portfolio";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  initialItems: PortfolioItem[];
};

function displayTag(item: PortfolioItem): string {
  if (item.style?.trim()) return item.style.trim();
  if (item.tags?.length) return item.tags[0];
  return "Portfolio";
}

export default function WebsitePortfolio({ initialItems }: Props) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = useMemo(() => {
    const set = new Set<string>();
    for (const i of initialItems) {
      const t = displayTag(i);
      if (t) set.add(t);
    }
    const list = Array.from(set).sort((a, b) => a.localeCompare(b));
    return ["All", ...list] as const;
  }, [initialItems]);

  const visible = useMemo(() => {
    if (activeFilter === "All") return initialItems;
    return initialItems.filter((i) => displayTag(i) === activeFilter);
  }, [initialItems, activeFilter]);

  return (
    <div className="flex w-full flex-col items-center px-4 py-12 md:px-10">
      <div className="w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
            Portfolio
          </h1>
          <p className="mb-16 text-sm uppercase tracking-[0.3em] text-[var(--ink-gray-400)]">
            Black & Grey Specialists • Beirut, Lebanon
          </p>
        </motion.div>

        {filters.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-16 flex flex-wrap items-center gap-8 border-b border-[var(--ink-gray-800)] pb-2"
          >
            {filters.map((label) => (
              <motion.button
                key={label}
                type="button"
                onClick={() => setActiveFilter(label)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative pb-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors ${
                  activeFilter === label
                    ? "text-white"
                    : "text-[var(--ink-gray-500)] hover:text-white"
                }`}
              >
                {label}
                {activeFilter === label && (
                  <motion.span
                    layoutId="portfolio-filter"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}

        {visible.length === 0 ? (
          <p className="text-center text-sm text-[var(--ink-gray-500)] py-16">
            New work will appear here once it is added from the admin portfolio.
          </p>
        ) : (
          <div className="masonry-grid mx-auto max-w-6xl gap-6">
            {visible.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease,
                }}
                className="masonry-item group relative cursor-pointer overflow-hidden border border-[var(--ink-gray-800)] bg-[var(--ink-gray-900)] transition-colors duration-500 hover:border-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs uppercase tracking-widest text-[var(--ink-gray-300)]">
                    {displayTag(img)}
                  </p>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                    {img.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
