"use client";

import StyleFilterControl from "@/components/ui/style-filter-control";
import {
  portfolioImageColorClass,
  useTapColorReveal,
} from "@/hooks/use-tap-color-reveal";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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
  const { toggleTileColor, isRevealed, clearRevealed } = useTapColorReveal();

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

  useEffect(() => {
    clearRevealed();
  }, [activeFilter, clearRevealed]);

  return (
    <div className="flex w-full flex-col items-center px-4 py-12 md:px-10">
      <div className="w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <h1 className="mb-2 text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl md:text-7xl">
            Portfolio
          </h1>
          <p className="mb-8 text-xs uppercase tracking-[0.2em] text-[var(--ink-gray-400)] sm:mb-16 sm:text-sm sm:tracking-[0.3em]">
            Black & Grey Specialists • Beirut, Lebanon
          </p>
        </motion.div>

        {filters.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
          >
            <StyleFilterControl
              options={[...filters]}
              value={activeFilter}
              onChange={setActiveFilter}
              variant="public"
              label="Style"
            />
          </motion.div>
        )}

        {visible.length === 0 ? (
          <p className="text-center text-sm text-[var(--ink-gray-500)] py-16">
            New work will appear here once it is added from the admin portfolio.
          </p>
        ) : (
          <div className="masonry-grid mx-auto max-w-6xl gap-6">
            {visible.map((img, i) => {
              const colorRevealed = isRevealed(img.id);
              return (
                <motion.button
                  key={img.id}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease,
                  }}
                  onClick={() => toggleTileColor(img.id)}
                  aria-label={
                    colorRevealed
                      ? `${img.title}, full color — tap again to hide`
                      : `${img.title} — tap to see in color`
                  }
                  className={`masonry-item group relative w-full cursor-pointer overflow-hidden border bg-[var(--ink-gray-900)] p-0 text-left transition-colors duration-500 touch-manipulation [@media(hover:hover)]:hover:border-white ${
                    colorRevealed
                      ? "border-white/40"
                      : "border-[var(--ink-gray-800)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt=""
                    aria-hidden
                    className={portfolioImageColorClass(colorRevealed, "duration-700")}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 opacity-100 [@media(hover:hover)]:from-black/40 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:p-6">
                    <p className="text-xs uppercase tracking-widest text-[var(--ink-gray-300)]">
                      {displayTag(img)}
                    </p>
                    <h3 className="text-base font-bold uppercase tracking-tight text-white sm:text-lg">
                      {img.title}
                    </h3>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
