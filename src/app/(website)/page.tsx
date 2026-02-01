"use client";

import Hero from "@/components/sections/hero";
import { motion } from "framer-motion";

const gridImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDv9lxhpDDg9UlJmH0VjDO1qJmQo9wozhLlXY8KzLn4k-BsTapreOAilwvc0SpHr07sGf6jgxVMiWRkoJ_daBd0Za3BBySuayRumY_5UpxKdKAG3U7-RENp8CocnTFZgZED1g5wI1QY8cqW2hzpufFy5mRH3N7fiHZ9_-1vF5xk6MP92UHYAR-RKbEvhBOU8Tg07bXgcZyjZrRkyd7UE_f6OSmYFAvEMaZ_R59wlkhfiplN9m03z2QsTWyT_oBGODTi1fajeLlzeyY3",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDS2F0Hv0rX1Uon-Z10VBQwkb262gwDx-uqZhhW58P_KpKOnJ0ShsvfbMxyFBQtVtjh28E4q_Z7rFH0kVoG3wNv4oz2duExPoPYN9KwE4Rn_EfYaLHv2HbG8MNd59xJkRSYO76oj_FvtbNh_ac6z10PXagQ2IcBIaOPRiu2-jf7wsSI431OzO3_0Ay2PduR42mXOn9SLslr0Lcxo9wj_kJtuuZtOZ3MKotBWzz7mSaskPdGXODcwOPkI5e2fNMobNYV8Lv6SKxzxwZZ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBkfaYgPCiKR9ictnwFOlNXOumEO7SpbScFbos1YjQhLMwBx_Zn8EiW3G6Z1wSWW3RgArHj2q-WGTVzQ0PPBOrxd3WRNMBCAKuf1TyXRritC-JXu37zjDhWe2A5bOeaPuysH749dl-QCF8FWJZ49NWgkv9EXykCNQLbSwNYJFzWIY9Mu5MDu8LCdy0oNdBFBWzOw1whL_TNiWrIQRczqjCTtf0-O4fEN6kgO-0lHCpH3a6643gsLkRyx3BuwZbuJ6Icaut4_nQgPP1y",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8lZXZFzRxRigwSp5-VD55cF1wVh7AjX8LoJM7yIvFbaHD0CHx3OU_fIobObCEi5GUGg2dtnj94erNVVDIyVhQfmkTRS6SlDXoRC8QwPZVw6TrRV9xgljm0jNcjEFh01NrEV3b1V3Qpy-FlfhIRrfHXSZgWcymrSZrkbUsfZGaBSLxc0_KhwBnK05Mm-NLB4r7WKhjGichVfYV8u8jHkSQRJwup5TUQH2lJ6eFJ_bvhv5FlkxSNEQRnepZT2WKyNBMMAHlI8oPtGX",
];

const values = [
  ["Sterile Studio", "Hospital-grade hygiene standards"],
  ["Custom Designs", "No copy-paste artwork"],
  ["Premium Inks", "Imported vegan pigments"],
  ["Aftercare Support", "Guided healing process"],
] as const;

export default function Home() {
  return (
    <>
      <Hero />

      {/* GRID PREVIEW */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="bg-black"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {[...gridImages, ...gridImages].map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: "-40px" }}
              className="group relative aspect-square overflow-hidden border border-[var(--ink-border)]"
            >
              <div
                className="h-full w-full bg-cover bg-center grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-110 group-hover:scale-105"
                style={{ backgroundImage: `url("${src}")` }}
              />
              <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex justify-center border-t border-[var(--ink-border)] py-20"
        >
          <motion.a
            href="/portfolio"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="font-display text-xs uppercase tracking-[0.25em] text-[var(--ink-gray-400)] hover:text-white border-b border-transparent hover:border-white pb-2 transition-colors"
          >
            View Full Archive
          </motion.a>
        </motion.div>
      </motion.section>

      {/* STUDIO VALUES */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-80px" }}
        className="border-t border-[var(--ink-border)] bg-black px-6 py-32 text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-display text-4xl uppercase tracking-[0.08em] text-white md:text-6xl lg:text-7xl"
        >
          Precision · Art · Identity
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                ease: [0.16, 1, 0.3, 1],
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

      {/* FINAL CTA */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="font-display mb-10 text-4xl uppercase tracking-[0.08em] text-white md:text-6xl lg:text-7xl"
        >
          Book Your Session
        </motion.h2>

        <motion.a
          href="/contact"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02, backgroundColor: "white", color: "black" }}
          whileTap={{ scale: 0.98 }}
          className="font-display inline-flex h-14 items-center justify-center border-2 border-white px-14 text-base uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
        >
          Contact Studio
        </motion.a>
      </motion.section>
    </>
  );
}
