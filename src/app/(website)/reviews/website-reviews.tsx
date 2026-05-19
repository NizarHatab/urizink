"use client";

import WriteReviewModal from "@/components/website/write-review-modal";
import type { ReviewListItem, ReviewsPayload } from "@/types/review";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { useMemo, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  initial: ReviewsPayload;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function WebsiteReviews({ initial }: Props) {
  const [reviews, setReviews] = useState(initial.reviews);
  const [stats, setStats] = useState(initial.stats);
  const [modalOpen, setModalOpen] = useState(false);

  const displayRating =
    stats.averageRating !== null ? stats.averageRating.toFixed(1) : "—";
  const fullStars =
    stats.averageRating !== null ? Math.round(stats.averageRating) : 0;

  const bars = useMemo(
    () =>
      stats.distribution
        .slice()
        .sort((a, b) => b.star - a.star)
        .map((d) => ({ stars: d.star, pct: d.percent })),
    [stats.distribution]
  );

  function onReviewSubmitted(item: ReviewListItem) {
    setReviews((prev) => [item, ...prev]);
    setStats((prev) => {
      const totalCount = prev.totalCount + 1;
      const sum =
        (prev.averageRating ?? 0) * prev.totalCount + item.rating;
      const averageRating = Math.round((sum / totalCount) * 100) / 100;
      const positiveCount =
        prev.distribution
          .filter((d) => d.star >= 4)
          .reduce((s, d) => s + d.count, 0) + (item.rating >= 4 ? 1 : 0);
      const distribution = prev.distribution.map((d) => {
        const count = d.count + (d.star === item.rating ? 1 : 0);
        return {
          ...d,
          count,
          percent: Math.round((count / totalCount) * 100),
        };
      });
      return {
        ...prev,
        totalCount,
        averageRating,
        newThisWeek: prev.newThisWeek + 1,
        positivePercent: Math.round((positiveCount / totalCount) * 100),
        distribution,
      };
    });
  }

  return (
    <div className="flex flex-1 justify-center px-5 py-10 md:px-40 w-full">
      <div className="flex w-full max-w-[960px] flex-col">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 border-b border-[var(--ink-border)] p-4"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Client Reviews
          </h1>
          <p className="mt-2 max-w-lg text-sm text-[var(--ink-gray-400)]">
            Real feedback from clients. Share your experience after your session.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
          className="mb-10 flex flex-col gap-8 p-4 md:flex-row md:gap-x-12"
        >
          <div>
            <p className="text-6xl font-black text-white">{displayRating}</p>
            <StarRow count={fullStars} />
            <p className="mt-2 text-sm text-[var(--ink-gray-500)]">
              Based on {stats.totalCount} review
              {stats.totalCount === 1 ? "" : "s"}
            </p>
          </div>

          {stats.totalCount > 0 && (
            <div className="grid min-w-[200px] max-w-[500px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-4">
              {bars.map((b, i) => (
                <div key={b.stars} className="contents">
                  <p className="text-sm text-[var(--ink-gray-400)]">{b.stars}</p>
                  <div className="h-1.5 overflow-hidden rounded-sm bg-[var(--ink-gray-800)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + i * 0.08,
                        ease,
                      }}
                      className="h-full bg-white"
                    />
                  </div>
                  <p className="text-right text-sm text-[var(--ink-gray-500)]">
                    {b.pct}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="px-4 pb-6"
        >
          <motion.button
            type="button"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.02, backgroundColor: "white", color: "black" }}
            whileTap={{ scale: 0.98 }}
            className="border border-white px-8 py-2.5 font-bold tracking-wide text-white transition-colors hover:bg-white hover:text-black"
          >
            Write a Review
          </motion.button>
        </motion.div>

        <div className="flex flex-col gap-6 p-4">
          {reviews.length === 0 ? (
            <p className="text-center text-sm text-[var(--ink-gray-500)] py-12">
              No reviews yet. Be the first to share your experience.
            </p>
          ) : (
            reviews.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
              >
                <PublicReviewCard review={r} />
              </motion.article>
            ))
          )}
        </div>
      </div>

      <WriteReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onReviewSubmitted}
      />
    </div>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="mt-1 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar
          key={i}
          className={`text-lg ${
            i < count ? "fill-white text-white" : "text-[var(--ink-gray-700)]"
          }`}
        />
      ))}
    </div>
  );
}

function PublicReviewCard({ review }: { review: ReviewListItem }) {
  return (
    <div className="border border-white/20 p-6 transition-colors hover:border-white/40">
      <div className="mb-3 flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ink-gray-800)] text-sm font-bold text-white">
          {initials(review.authorName)}
        </div>
        <div>
          <p className="font-bold text-white">{review.authorName}</p>
          <p className="text-xs text-[var(--ink-gray-500)]">{review.timeAgo}</p>
        </div>
      </div>
      <StarRow count={review.rating} />
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-gray-300)]">
        {review.comment}
      </p>
    </div>
  );
}
