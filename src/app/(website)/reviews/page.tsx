"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

const ease = [0.16, 1, 0.3, 1] as const;

const bars = [
  { stars: 5, pct: 75 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 2 },
];

const reviews = [
  {
    name: "Sarah M.",
    time: "2 months ago",
    stars: 5,
    helpful: 15,
    notHelpful: 2,
    text: "UrizInk is an exceptional artist. Their attention to detail and ability to translate my vision into a stunning tattoo exceeded my expectations.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2wQi8IIumu3OOaZgQ4ZcyNdno7knxav8rWsR3WHpIyz4E0xR9TL_LyGHElCH8y8MxFYWAZtTibT58qaXGkq__N78VQfqpkPj7Q7ZWdJDGRbhNb5XYyf80i-tzCaty08kvAKAcP9DqVv9UMRc9dltVcOKAGpU3wJHw2U2OIKP5OrAvn7wxOCm8MWfwwId42EBK2rTGi6sl_XcrNXwaB-JU_ThLWnbA2q1xkYiz8S0Dk4b_Hjx2oUU6bZahIPYQFxzrfCpZMEW9yM3L",
  },
  {
    name: "David L.",
    time: "3 months ago",
    stars: 4,
    helpful: 8,
    notHelpful: 1,
    text: "Great experience. The tattoo is well-done and the artist was very professional. Worth the wait.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjqarNFPvNeRl_kQF1XnRwZXB1StP2m7OHTwsOrrknozr1agZtV5wXq02qlMQuLzW3tFDNfDImYjZ3LiLNvJ0qbgT_4PWz2K0GXwBuYE8IBPP1ebQTIpnoUK3BJL-c9j83AWH1RBpcXlk7U0Uhu_CAUA4PYJA5YQcWyr6KFqMzg9S-uiZKnTQMHLn6lUkZQ1YprlDtiM1k-nFQsNNxFQsRmQGd7ptD21sRocUKf8TZiM4uEBF3hoF7b3bSmh7TEzC_3sl4lzfu9uRY",
  },
  {
    name: "Emily R.",
    time: "4 months ago",
    stars: 5,
    helpful: 22,
    notHelpful: 3,
    text: "Absolutely love my new tattoo! The artist was incredibly talented and made the process enjoyable.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQwZF5blgCn3dTqUB4vyJjyQwIpMQneoupFbTbpGgFv8QgP1GzVKfWl5Xbo7ebGkHF_NbDe3DccoIbc_LyL49it3ZmJ9JKl2C2t7rKVXThuQ4E9vyS2AHSvmZnq8AArdW5z1j95n3r4e9k4ZpO6bwzyMw_W7xiddEm5-_anjR8JPKibtel2c-vWe3W3L8FTaKRozbu9w89S-go6bygaJKsdRgIIFTVpAhLWMzTdh3L8l0qt3XE4fx1MdWsfKP1-edqwlcjOrf3PTw9",
  },
];

export default function Page() {
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
                4.8
              </motion.p>
              <Stars count={4} />
              <p className="mt-2 text-sm text-[var(--ink-gray-500)]">
                Based on 125 reviews
              </p>
            </div>

            <div className="grid min-w-[200px] max-w-[500px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-4">
              {bars.map((b, i) => (
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
              ))}
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
              whileHover={{ scale: 1.02, backgroundColor: "white", color: "black" }}
              whileTap={{ scale: 0.98 }}
              className="border border-white px-8 py-2.5 font-bold tracking-wide text-white transition-colors hover:bg-white hover:text-black"
            >
              Write a Review
            </motion.button>
          </motion.div>

          {/* REVIEWS */}
          <div className="flex flex-col gap-6 p-4">
            {reviews.map((r, i) => (
              <motion.div
                key={r.name}
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
            ))}
          </div>
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
}: (typeof reviews)[0]) {
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
