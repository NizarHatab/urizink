"use client";

import Hero from "@/components/sections/hero";
import type { PortfolioItem } from "@/types/portfolio";
import type { ReviewListItem, ReviewStats } from "@/types/review";
import {
  portfolioImageColorClass,
  useTapColorReveal,
} from "@/hooks/use-tap-color-reveal";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const values = [
  ["Sterile Studio", "Hospital-grade hygiene standards"],
  ["Custom Designs", "No copy-paste artwork"],
  ["Premium Inks", "Imported vegan pigments"],
  ["Aftercare Support", "Guided healing process"],
] as const;

type Props = {
  portfolioPreview: PortfolioItem[];
  latestReviews: ReviewListItem[];
  reviewStats: ReviewStats;
};

function portfolioTag(item: PortfolioItem): string {
  if (item.style?.trim()) return item.style.trim();
  if (item.tags?.length) return item.tags[0];
  return "Portfolio";
}

function reviewInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function SectionIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <p className="font-display mb-2 text-xs uppercase tracking-[0.35em] text-[var(--ink-gray-500)]">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl uppercase tracking-[0.06em] text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-gray-400)] md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function SectionCta({
  href,
  label,
  variant = "outline",
}: {
  href: string;
  label: string;
  variant?: "outline" | "solid";
}) {
  const className =
    variant === "solid"
      ? "font-display inline-flex min-h-[48px] w-full items-center justify-center bg-white px-8 text-sm font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[var(--ink-gray-200)] sm:w-auto"
      : "font-display inline-flex min-h-[48px] w-full items-center justify-center border-2 border-white px-8 text-sm uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black sm:w-auto";

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export default function HomePage({
  portfolioPreview,
  latestReviews,
  reviewStats,
}: Props) {
  const { handleTileClick, isRevealed } = useTapColorReveal();

  const mobilePortfolio = portfolioPreview.slice(0, 4);
  const desktopExtra = portfolioPreview.slice(4, 8);

  return (
    <>
      <Hero />

      {/* Featured portfolio */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        viewport={{ once: true, margin: "-60px" }}
        className="border-b border-[var(--ink-border)] bg-black px-4 py-14 sm:px-6 md:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <SectionIntro
            eyebrow="Selected work"
            title="From the portfolio"
            description="A glimpse of recent black & grey pieces from the studio. See the full archive for more."
          />

          {portfolioPreview.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
                {mobilePortfolio.map((item, i) => (
                  <PortfolioTile
                    key={item.id}
                    item={item}
                    index={i}
                    colorRevealed={isRevealed(item.id)}
                    onTileClick={handleTileClick}
                  />
                ))}
                {desktopExtra.map((item, i) => (
                  <PortfolioTile
                    key={item.id}
                    item={item}
                    index={i + mobilePortfolio.length}
                    className="hidden sm:block"
                    colorRevealed={isRevealed(item.id)}
                    onTileClick={handleTileClick}
                  />
                ))}
              </div>

              <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-center text-xs uppercase tracking-[0.2em] text-[var(--ink-gray-500)] sm:text-left">
                  {portfolioPreview.length}+ pieces in the archive
                </p>
                <SectionCta href="/portfolio" label="View full portfolio" />
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--ink-gray-800)] px-6 py-14 text-center">
              <p className="text-sm text-[var(--ink-gray-500)]">
                New work will appear here once it is added from the admin portfolio.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Latest reviews */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        viewport={{ once: true, margin: "-60px" }}
        className="border-b border-[var(--ink-border)] bg-black px-4 py-14 sm:px-6 md:py-20 lg:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionIntro
              eyebrow="Client voices"
              title="Recent reviews"
              description={
                reviewStats.totalCount > 0
                  ? "Real feedback from people who have been in the chair."
                  : "Be the first to share your experience after your session."
              }
            />
            {reviewStats.totalCount > 0 && reviewStats.averageRating != null && (
              <div className="flex shrink-0 items-center gap-4 rounded-lg border border-[var(--ink-border)] bg-[var(--ink-gray-900)] px-5 py-4 md:mb-2">
                <p className="font-display text-4xl leading-none text-white md:text-5xl">
                  {reviewStats.averageRating.toFixed(1)}
                </p>
                <div>
                  <StarRow count={Math.round(reviewStats.averageRating)} />
                  <p className="mt-1 text-xs text-[var(--ink-gray-500)]">
                    {reviewStats.totalCount} review
                    {reviewStats.totalCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {latestReviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {latestReviews.map((review, i) => (
                <motion.article
                  key={review.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease }}
                  viewport={{ once: true, margin: "-20px" }}
                >
                  <ReviewPreviewCard review={review} />
                </motion.article>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--ink-gray-500)]">
              Reviews will show here once clients share their experience.
            </p>
          )}

          <div className="mt-10 flex justify-center md:justify-start">
            <SectionCta href="/reviews" label="Read all reviews" variant="outline" />
          </div>
        </div>
      </motion.section>

      {/* Studio story + values */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        viewport={{ once: true, margin: "-60px" }}
        className="border-b border-[var(--ink-border)] bg-black px-4 py-16 text-center sm:px-6 md:py-24 lg:px-10"
      >
        <div className="mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            viewport={{ once: true }}
            className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-5xl md:text-6xl"
          >
            Precision · Art · Identity
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            viewport={{ once: true }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[var(--ink-gray-400)] md:text-lg"
          >
            UrizInk is a private tattoo studio specializing in black & grey realism,
            fine-line geometry, and dark art. Every piece is fully custom — designed
            to age with elegance and intensity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {values.map(([title, desc]) => (
              <div key={title} className="border-t border-[var(--ink-border)] pt-4">
                <h3 className="font-display mb-2 text-xs uppercase tracking-[0.15em] text-white">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--ink-gray-500)]">
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Book CTA */}
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        viewport={{ once: true, margin: "-60px" }}
        className="bg-black px-4 py-16 text-center sm:px-6 md:py-24 lg:px-10"
      >
        <p className="font-display mb-4 text-xs uppercase tracking-[0.3em] text-[var(--ink-gray-500)]">
          Ready to start?
        </p>
        <h2 className="font-display mb-8 text-3xl uppercase tracking-[0.08em] text-white sm:text-5xl md:text-6xl">
          Book your session
        </h2>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <SectionCta href="/book" label="Request a booking" variant="solid" />
          <SectionCta href="/contact" label="Contact studio" variant="outline" />
        </div>
      </motion.section>
    </>
  );
}

function PortfolioTile({
  item,
  index,
  className = "",
  colorRevealed,
  onTileClick,
}: {
  item: PortfolioItem;
  index: number;
  className?: string;
  colorRevealed: boolean;
  onTileClick: (e: React.MouseEvent, id: string) => void;
}) {
  const tag = portfolioTag(item);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease }}
      viewport={{ once: true, margin: "-20px" }}
      className={`group relative aspect-[3/4] overflow-hidden border border-[var(--ink-border)] bg-[var(--ink-gray-900)] ${className} ${
        colorRevealed ? "border-white/40" : ""
      }`}
    >
      <Link
        href="/portfolio"
        className="block h-full w-full touch-manipulation"
        onClick={(e) => onTileClick(e, item.id)}
        aria-label={
          colorRevealed
            ? `${item.title}, full color — tap again to hide`
            : `${item.title} — tap to see in color`
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt=""
          aria-hidden
          className={portfolioImageColorClass(colorRevealed)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 [@media(hover:hover)]:opacity-80 [@media(hover:hover)]:group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
          <p className="truncate text-[9px] uppercase tracking-widest text-[var(--ink-gray-400)] sm:text-[10px]">
            {tag}
          </p>
          <p className="truncate text-xs font-bold text-white sm:text-sm">
            {item.title}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`text-sm ${
            i < count ? "fill-white text-white" : "text-[var(--ink-gray-700)]"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewPreviewCard({ review }: { review: ReviewListItem }) {
  const excerpt =
    review.comment && review.comment.length > 160
      ? `${review.comment.slice(0, 160)}…`
      : review.comment;

  return (
    <div className="flex h-full flex-col border border-[var(--ink-border)] bg-[var(--ink-gray-900)]/50 p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ink-gray-800)] text-xs font-bold text-white">
          {reviewInitials(review.authorName)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{review.authorName}</p>
          <p className="text-[10px] uppercase tracking-wider text-[var(--ink-gray-500)]">
            {review.timeAgo}
          </p>
        </div>
      </div>
      <StarRow count={review.rating} />
      {excerpt ? (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--ink-gray-300)]">
          &ldquo;{excerpt}&rdquo;
        </p>
      ) : (
        <p className="mt-3 text-sm italic text-[var(--ink-gray-500)]">
          Rated {review.rating} stars
        </p>
      )}
    </div>
  );
}
