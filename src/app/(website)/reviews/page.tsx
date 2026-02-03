"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getReviews, getReviewStats, createReview } from "@/lib/api/reviews";
import { notify } from "@/lib/ui/toast";

const ease = [0.16, 1, 0.3, 1] as const;

type ReviewCardProps = {
  name: string;
  time: string;
  stars: number;
  helpful: number;
  notHelpful: number;
  text: string;
  image: string;
};

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffMonths < 1) return "Last month";
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
}

export default function Page() {
  const [stats, setStats] = useState<{
    averageRating: number | null;
    totalReviews: number;
    ratingDistribution: Array<{ rating: number; count: number; percent: number }>;
  } | null>(null);
  const [reviews, setReviews] = useState<ReviewCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getReviewStats(), getReviews({ limit: 20 })]).then(
      ([statsRes, reviewsRes]) => {
        if (cancelled) return;
        if (statsRes.success && statsRes.data) {
          setStats({
            averageRating: statsRes.data.averageRating,
            totalReviews: statsRes.data.totalReviews,
            ratingDistribution: statsRes.data.ratingDistribution,
          });
        }
        if (reviewsRes.success && reviewsRes.data) {
          setReviews(
            reviewsRes.data.map((r) => ({
              name: `${r.firstName} ${r.lastName}`.trim() || "Anonymous",
              time: formatRelativeTime(r.createdAt),
              stars: r.rating,
              helpful: Math.floor(Math.random() * 20) + 5, // Mock helpful count
              notHelpful: Math.floor(Math.random() * 5), // Mock not helpful count
              text: r.comment || "No comment provided",
              image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                `${r.firstName} ${r.lastName}`.trim() || "Anonymous"
              )}&background=random`,
            }))
          );
        }
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleReviewSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    try {
      const formData = new FormData(form);
      const payload = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: (formData.get("phone") as string) || undefined,
        rating: parseInt(formData.get("rating") as string, 10),
        comment: (formData.get("comment") as string) || undefined,
      };

      const { success, error } = await createReview(payload);
      if (!success) {
        notify.error(error || "Failed to submit review");
        setSubmitting(false);
        return;
      }

      notify.success("Thank you! Your review has been submitted.");
      form.reset();
      setShowReviewForm(false);
      
      // Refresh reviews and stats
      const [statsRes, reviewsRes] = await Promise.all([
        getReviewStats(),
        getReviews({ limit: 20 }),
      ]);
      if (statsRes.success && statsRes.data) {
        setStats({
          averageRating: statsRes.data.averageRating,
          totalReviews: statsRes.data.totalReviews,
          ratingDistribution: statsRes.data.ratingDistribution,
        });
      }
      if (reviewsRes.success && reviewsRes.data) {
        setReviews(
          reviewsRes.data.map((r) => ({
            name: `${r.firstName} ${r.lastName}`.trim() || "Anonymous",
            time: formatRelativeTime(r.createdAt),
            stars: r.rating,
            helpful: Math.floor(Math.random() * 20) + 5,
            notHelpful: Math.floor(Math.random() * 5),
            text: r.comment || "No comment provided",
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              `${r.firstName} ${r.lastName}`.trim() || "Anonymous"
            )}&background=random`,
          }))
        );
      }
    } catch (err) {
      notify.error(
        err instanceof Error ? err.message : "Failed to submit review"
      );
    } finally {
      setSubmitting(false);
    }
  }

  const bars = stats?.ratingDistribution
    .sort((a, b) => b.rating - a.rating)
    .map((r) => ({ stars: r.rating, pct: r.percent })) || [];

  return (
    <div className="flex flex-1 justify-center px-5 py-10 md:px-40 w-full">
        <div className="flex w-full max-w-[960px] flex-col">
          {/* TITLE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8 border-b border-[var(--ink-border)] p-4"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Client Reviews
            </h1>
            <p className="mt-2 max-w-lg text-sm text-[var(--ink-gray-400)]">
              Authentic experiences from our clients. Clean lines, sterile
              environments, and artistic integrity.
            </p>
          </motion.div>

          {/* SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-10 flex flex-col gap-8 p-4 md:flex-row md:gap-x-12"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="text-6xl font-black text-white"
              >
                {loading ? "—" : stats?.averageRating?.toFixed(1) ?? "0.0"}
              </motion.p>
              <Stars count={stats?.averageRating ? Math.round(stats.averageRating) : 0} />
              <p className="mt-2 text-sm text-[var(--ink-gray-500)]">
                Based on {loading ? "—" : stats?.totalReviews ?? 0} reviews
              </p>
            </div>

            <div className="grid min-w-[200px] max-w-[500px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-4">
              {loading ? (
                <p className="text-sm text-[var(--ink-gray-500)]">Loading...</p>
              ) : (
                bars.map((b, i) => (
                  <motion.div
                    key={b.stars}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + i * 0.05,
                      ease,
                    }}
                    className="contents"
                  >
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
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="px-4 pb-6"
          >
            <motion.button
              type="button"
              onClick={() => setShowReviewForm(true)}
              whileHover={{ scale: 1.02, backgroundColor: "white", color: "black" }}
              whileTap={{ scale: 0.98 }}
              className="border border-white px-8 py-2.5 font-bold tracking-wide text-white transition-colors hover:bg-white hover:text-black"
            >
              Write a Review
            </motion.button>
          </motion.div>

          {/* REVIEWS */}
          <div className="flex flex-col gap-6 p-4">
            {loading ? (
              <p className="text-[var(--ink-gray-500)]">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-[var(--ink-gray-500)]">No reviews yet.</p>
            ) : (
              reviews.map((r, i) => (
                <motion.div
                  key={`${r.name}-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease,
                  }}
                >
                  <ReviewCard {...r} />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={() => setShowReviewForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-lg border border-white/20 bg-[#0a0a0a] p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Write a Review</h2>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      required
                      className="rounded border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      required
                      className="rounded border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
                  />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (optional)"
                    className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
                  />

                  <div>
                    <label className="mb-2 block text-sm text-gray-400">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <label
                          key={rating}
                          className="cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            required
                            className="peer sr-only"
                          />
                          <span className="peer-checked:text-yellow-400">
                            <FiStar className="h-8 w-8 text-gray-600 transition-colors hover:text-yellow-400" />
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <textarea
                    name="comment"
                    placeholder="Your review (optional)"
                    rows={4}
                    className="w-full rounded border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-white/30 focus:outline-none"
                  />

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="flex-1 rounded border border-white/20 px-4 py-2 text-white transition-colors hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 rounded bg-white px-4 py-2 font-bold text-black transition-colors hover:bg-gray-200 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Stars({ count }: { count: number }) {
  return (
    <div className="mt-1 flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-lg ${
            i < count ? "text-white" : "text-[var(--ink-gray-700)]"
          }`}
        >
          {/* react icon filled stars sar */}
          <FiStar />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({
  name,
  time,
  stars,
  text,
  helpful,
  notHelpful,
  image,
}: ReviewCardProps) {
  return (
    <motion.div
      whileHover={{ borderColor: "rgba(255,255,255,0.4)" }}
      className="border border-white/20 p-6 transition-colors"
    >
      <div className="mb-3 flex items-center gap-4">
        <div
          className="h-12 w-12 flex-shrink-0 rounded-full bg-cover grayscale"
          style={{ backgroundImage: `url("${image}")` }}
        />
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-xs text-[var(--ink-gray-500)]">{time}</p>
        </div>
      </div>
      <Stars count={stars} />
      <p className="mt-3 text-sm leading-relaxed text-[var(--ink-gray-300)]">
        {text}
      </p>
      <div className="mt-4 flex gap-6 border-t border-white/5 pt-4 text-xs">
        <button
          type="button"
          className="flex items-center gap-1 text-[var(--ink-gray-500)] transition-colors hover:text-white"
        >
          👍 Helpful ({helpful})
        </button>
        <button
          type="button"
          className="flex items-center gap-1 text-[var(--ink-gray-500)] transition-colors hover:text-white"
        >
          👎 Not Helpful ({notHelpful})
        </button>
      </div>
    </motion.div>
  );
}
