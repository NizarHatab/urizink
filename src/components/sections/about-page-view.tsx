"use client";

import {
  ABOUT_STANDARD_ICONS,
  type AboutPageContent,
} from "@/lib/about-page";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  content: AboutPageContent;
};

export default function AboutPageView({ content }: Props) {
  return (
    <div className="flex w-full flex-col bg-black">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        className="border-b border-[var(--ink-border)] px-6 pb-12 pt-20 md:px-10 md:pb-16 md:pt-24"
      >
        <p className="font-display mb-4 text-xs uppercase tracking-[0.35em] text-[var(--ink-gray-500)]">
          {content.headerEyebrow}
        </p>
        <h1 className="font-display text-5xl uppercase tracking-[0.06em] text-white md:text-7xl lg:text-8xl">
          {content.headerTitle}
        </h1>
        {content.headerSubtitle ? (
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[var(--ink-gray-400)] md:text-base">
            {content.headerSubtitle}
          </p>
        ) : null}
      </motion.header>

      <section className="border-b border-[var(--ink-border)] px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease }}
            viewport={{ once: true, margin: "-80px" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden border border-[var(--ink-border)] bg-[var(--ink-gray-900)]">
              <Image
                src="/images/yara-hero.jpeg"
                alt="Uriz — tattoo artist at UrizInk"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-[center_15%] grayscale contrast-110 transition-all duration-700 hover:grayscale-0"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <p className="mt-4 font-display text-xs uppercase tracking-[0.25em] text-[var(--ink-gray-500)]">
              {content.artistImageCaption}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col justify-center space-y-8"
          >
            <div>
              <h2 className="font-display mb-6 text-2xl uppercase tracking-[0.12em] text-white md:text-3xl">
                {content.workHeading}
              </h2>
              {content.workParagraph1 ? (
                <p className="text-base leading-relaxed text-[var(--ink-gray-400)] md:text-lg">
                  {content.workParagraph1}
                </p>
              ) : null}
              {content.workParagraph2 ? (
                <p className="mt-6 text-base leading-relaxed text-[var(--ink-gray-400)] md:text-lg">
                  {content.workParagraph2}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/portfolio"
                className="font-display border border-[var(--ink-gray-600)] px-6 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                View portfolio
              </Link>
              <Link
                href="/contact"
                className="font-display border border-transparent px-6 py-3 text-xs uppercase tracking-[0.2em] text-[var(--ink-gray-400)] transition-colors hover:text-white"
              >
                Get in touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          viewport={{ once: true }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="font-display mb-12 text-center text-2xl uppercase tracking-[0.15em] text-white md:text-3xl">
            {content.standardsHeading}
          </h2>
          <div className="grid grid-cols-1 gap-px border border-[var(--ink-border)] bg-[var(--ink-border)] sm:grid-cols-2">
            {content.standards.map((s, i) => {
              const Icon = ABOUT_STANDARD_ICONS[i] ?? ABOUT_STANDARD_ICONS[0];
              return (
                <motion.article
                  key={`${s.title}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-4 bg-black p-8 md:p-10"
                >
                  <Icon
                    className="size-6 text-[var(--ink-gray-500)]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <h3 className="font-display text-sm uppercase tracking-[0.15em] text-white">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--ink-gray-500)]">
                    {s.text}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
        viewport={{ once: true }}
        className="border-t border-[var(--ink-border)] px-6 py-20 text-center md:py-28"
      >
        <p className="font-display mb-3 text-xs uppercase tracking-[0.3em] text-[var(--ink-gray-500)]">
          {content.ctaEyebrow}
        </p>
        <h2 className="font-display mb-10 text-3xl uppercase tracking-[0.08em] text-white md:text-4xl">
          {content.ctaTitle}
        </h2>
        <Link href="/book">
          <motion.span
            className="font-display inline-flex h-14 items-center justify-center border-2 border-white px-12 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {content.ctaButtonLabel}
          </motion.span>
        </Link>
      </motion.section>
    </div>
  );
}
