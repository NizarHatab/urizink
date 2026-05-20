"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type HeroIntro = {
  heading: string;
  body: string;
};

type Props = {
  intro?: HeroIntro | null;
};

function introParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function Hero({ intro }: Props) {
  const hasIntro = Boolean(intro?.body.trim() || intro?.heading.trim());
  const paragraphs = intro ? introParagraphs(intro.body) : [];

  return (
    <section className="relative min-h-[80vh] overflow-hidden border-b border-[var(--ink-border)] sm:min-h-[88vh] lg:min-h-[92vh]">
      <Image
        src="/images/yara-hero.jpeg"
        alt="UrizInk Blackwork Tattoo"
        fill
        priority
        className={`object-cover object-[center_20%] grayscale contrast-125 ${
          hasIntro ? "lg:object-[center_30%]" : ""
        }`}
      />

      {/* Readability overlays */}
      <div
        className={`absolute inset-0 ${
          hasIntro
            ? "bg-gradient-to-r from-black via-black/75 to-black/25 lg:from-black/95 lg:via-black/70 lg:to-transparent"
            : "bg-gradient-to-t from-black via-black/40 to-black/20"
        }`}
      />
      {hasIntro ? (
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 lg:hidden" />
      ) : null}

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={`relative z-10 mx-auto flex h-full min-h-[inherit] w-full max-w-7xl flex-col px-5 py-16 sm:px-8 sm:py-20 lg:px-10 ${
          hasIntro
            ? "justify-end lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:justify-center lg:gap-12 lg:py-24"
            : "items-center justify-center"
        }`}
      >
        {hasIntro && intro ? (
          <motion.div
            variants={item}
            className="mb-10 max-w-xl lg:mb-0 lg:max-w-none lg:pr-4"
          >
            <p className="font-display mb-3 text-[10px] uppercase tracking-[0.4em] text-[var(--ink-gray-400)] sm:text-xs">
              UrizInk · Beirut
            </p>
            <h1 className="font-display text-4xl uppercase leading-[0.95] tracking-[0.06em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              {intro.heading}
            </h1>
            <div className="mt-6 space-y-4 border-l-2 border-white/25 pl-5 sm:mt-8 sm:pl-6">
              {paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-sm leading-relaxed text-white/95 sm:text-base lg:text-lg"
                      : "text-sm leading-relaxed text-[var(--ink-gray-400)]"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        ) : null}

        <motion.div
          variants={container}
          className={`flex flex-col ${
            hasIntro
              ? "items-start text-left lg:items-end lg:text-right"
              : "max-w-4xl items-center text-center"
          }`}
        >
          {!hasIntro ? (
            <motion.h1
              variants={item}
              className="font-display text-6xl uppercase tracking-[0.08em] text-white md:text-7xl lg:text-8xl xl:text-[6rem]"
            >
              BLACKWORK
            </motion.h1>
          ) : (
            <motion.p
              variants={item}
              className="font-display text-2xl uppercase tracking-[0.12em] text-white/90 sm:text-3xl lg:text-4xl"
            >
              Blackwork
            </motion.p>
          )}

          <motion.p
            variants={item}
            className={`font-display mt-4 text-xs uppercase tracking-[0.3em] text-[var(--ink-gray-300)] sm:text-sm sm:tracking-[0.35em] ${
              hasIntro ? "lg:mt-6" : "mt-8 md:tracking-[0.4em]"
            }`}
          >
            Fine Line · Dark Art · Custom Tattoos
          </motion.p>

          <motion.div
            variants={item}
            className={`mt-8 flex flex-wrap gap-4 sm:mt-10 sm:gap-5 ${
              hasIntro ? "lg:justify-end" : "justify-center"
            }`}
          >
            <Link href="/portfolio">
              <motion.span
                className="font-display inline-flex min-h-[48px] items-center justify-center border-2 border-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-white sm:px-10 sm:text-sm"
                whileHover={{ backgroundColor: "white", color: "black" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                View Portfolio
              </motion.span>
            </Link>
            <Link href="/book">
              <motion.span
                className="font-display inline-flex min-h-[48px] items-center justify-center border-2 border-white/40 px-8 py-3.5 text-xs uppercase tracking-[0.2em] text-[var(--ink-gray-200)] sm:px-10 sm:text-sm"
                whileHover={{ borderColor: "white", color: "white" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Book Session
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
