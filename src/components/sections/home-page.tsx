"use client";

import Hero from "@/components/sections/hero";
import { motion } from "framer-motion";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

const values = [
  ["Sterile Studio", "Hospital-grade hygiene standards"],
  ["Custom Designs", "No copy-paste artwork"],
  ["Premium Inks", "Imported vegan pigments"],
  ["Aftercare Support", "Guided healing process"],
] as const;

type Props = {
  previewImages: string[];
};

export default function HomePage({ previewImages }: Props) {
  const gridSlots = previewImages.slice(0, 12);

  return (
    <>
      <Hero />

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease }}
        viewport={{ once: true, margin: "-80px" }}
        className="bg-black"
      >
        {gridSlots.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
          >
            {gridSlots.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease,
                }}
                viewport={{ once: true, margin: "-40px" }}
                className="group relative aspect-square overflow-hidden border border-[var(--ink-border)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="border-b border-[var(--ink-border)] px-6 py-20 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ink-gray-500)]">
              Portfolio pieces appear here once uploaded from admin.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          viewport={{ once: true }}
          className="flex justify-center border-t border-[var(--ink-border)] py-20"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/portfolio"
              className="font-display text-xs uppercase tracking-[0.25em] text-[var(--ink-gray-400)] hover:text-white border-b border-transparent hover:border-white pb-2 transition-colors"
            >
              View Full Archive
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        viewport={{ once: true, margin: "-80px" }}
        className="border-t border-[var(--ink-border)] bg-black px-6 py-32 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          viewport={{ once: true }}
          className="font-display text-4xl uppercase tracking-[0.08em] text-white md:text-6xl lg:text-7xl"
        >
          Precision · Art · Identity
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ink-gray-400)]"
        >
          UrizInk is a private tattoo studio specializing in black & grey
          realism, fine-line geometry, and dark art. Every piece is fully custom
          — designed to age with elegance and intensity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-12"
        >
          {values.map(([title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5 + i * 0.08,
                ease,
              }}
              viewport={{ once: true }}
              className="max-w-[220px] text-left"
            >
              <h3 className="font-display mb-2 text-sm uppercase tracking-[0.15em] text-white">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--ink-gray-500)]">
                {desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        viewport={{ once: true, margin: "-80px" }}
        className="border-t border-[var(--ink-border)] bg-black py-28 text-center"
      >
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-display mb-6 text-sm uppercase tracking-[0.3em] text-[var(--ink-gray-500)]"
        >
          Ready to start?
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          viewport={{ once: true }}
          className="font-display mb-10 text-4xl uppercase tracking-[0.08em] text-white md:text-6xl lg:text-7xl"
        >
          Book Your Session
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          viewport={{ once: true }}
          className="inline-block"
        >
          <Link href="/contact" className="inline-block">
            <motion.span
              className="font-display inline-flex h-14 items-center justify-center border-2 border-white px-14 text-base uppercase tracking-[0.2em] text-white"
              whileHover={{
                scale: 1.02,
                backgroundColor: "white",
                color: "black",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Contact Studio
            </motion.span>
          </Link>
        </motion.div>
      </motion.section>
    </>
  );
}
