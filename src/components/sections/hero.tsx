"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] min-h-[650px] items-center justify-center overflow-hidden border-b border-[var(--ink-border)]">
      <Image
        src="/images/yara-hero.jpeg"
        alt="UrizInk Blackwork Tattoo"
        fill
        priority
        className="object-contain sm:object-cover lg:object-[center_20%] grayscale contrast-125"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl px-6 text-center"
      >
        <motion.h1
          variants={item}
          className="font-display text-6xl uppercase tracking-[0.08em] text-white md:text-7xl lg:text-8xl xl:text-[6rem]"
        >
          BLACKWORK
        </motion.h1>

        <motion.p
          variants={item}
          className="font-display mt-8 text-sm uppercase tracking-[0.35em] text-[var(--ink-gray-300)] md:text-base md:tracking-[0.4em]"
        >
          Fine Line · Dark Art · Custom Tattoos
        </motion.p>

        <motion.div
          variants={item}
          className="mt-14 flex flex-wrap justify-center gap-5 md:gap-6"
        >
          <Link href="/portfolio">
            <motion.span
              className="font-display inline-flex items-center justify-center border-2 border-white px-10 py-4 text-sm uppercase tracking-[0.2em] text-white md:px-12 md:py-5 md:text-base"
              whileHover={{ backgroundColor: "white", color: "black" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              View Portfolio
            </motion.span>
          </Link>
          <Link href="/contact">
            <motion.span
              className="font-display inline-flex items-center justify-center border-2 border-[var(--ink-gray-600)] px-10 py-4 text-sm uppercase tracking-[0.2em] text-[var(--ink-gray-300)] md:px-12 md:py-5 md:text-base"
              whileHover={{
                borderColor: "white",
                color: "white",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Book Session
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
