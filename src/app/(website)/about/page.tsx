"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const standards = [
  {
    title: "Sterile Environment",
    text: "Hospital-grade sterilization and single-use disposables. Safety is the foundation of our art.",
  },
  {
    title: "Custom Consultation",
    text: "No copy-paste designs. Each tattoo begins with a detailed dialogue.",
  },
  {
    title: "Premium Materials",
    text: "Only the highest quality vegan inks and precision needles.",
  },
  {
    title: "Aftercare Support",
    text: "Detailed guidance provided for optimal healing and longevity.",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Page() {
  return (
    <div className="flex w-full flex-col bg-black">
        {/* TITLE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full border-b border-[var(--ink-border)] px-6 pb-10 pt-20 md:px-10"
        >
          <h1 className="text-5xl font-black uppercase leading-none tracking-tighter text-white md:text-8xl">
            Behind <br /> The Ink
          </h1>
        </motion.section>

        {/* ABOUT */}
        <section className="w-full px-6 py-16 md:px-10 md:py-24">
          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-12 lg:gap-24">
            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease }}
              viewport={{ once: true, margin: "-60px" }}
              className="group relative md:col-span-5 lg:col-span-4"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--ink-gray-900)]">
                <div
                  className="absolute inset-0 bg-cover bg-center grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDv9lxhpDDg9UlJmH0VjDO1qJmQo9wozhLlXY8KzLn4k-BsTapreOAilwvc0SpHr07sGf6jgxVMiWRkoJ_daBd0Za3BBySuayRumY_5UpxKdKAG3U7-RENp8CocnTFZgZED1g5wI1QY8cqW2hzpufFy5mRH3N7fiHZ9_-1vF5xk6MP92UHYAR-RKbEvhBOU8Tg07bXgcZyjZrRkyd7UE_f6OSmYFAvEMaZ_R59wlkhfiplN9m03z2QsTWyT_oBGODTi1fajeLlzeyY3")',
                  }}
                />
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-mono uppercase tracking-widest text-[var(--ink-gray-500)]">
                <span>Artist / Founder</span>
                <span>Est. 2018</span>
              </div>
            </motion.div>

            {/* TEXT */}
            <div className="flex h-full flex-col justify-between pt-4 md:col-span-7 lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
                viewport={{ once: true, margin: "-60px" }}
                className="mb-16"
              >
                <h2 className="mb-8 border-l-4 border-white pl-6 text-2xl font-bold uppercase tracking-wide text-white">
                  Ink Artistry
                </h2>
                <p className="mb-8 max-w-2xl text-lg font-light leading-relaxed text-[var(--ink-gray-400)] md:text-xl">
                  UrizInk represents a raw, monochromatic dialogue between skin
                  and needle. Based in the heart of Lebanon, my work is strictly
                  confined to black and grey — realism, fine-line geometry, and
                  custom dark art.
                </p>
                <p className="max-w-2xl text-lg font-light leading-relaxed text-[var(--ink-gray-400)] md:text-xl">
                  Tattoos are not decoration — they are permanent markers of
                  identity. Every piece is a collaboration designed to age with
                  grace and boldness.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                viewport={{ once: true, margin: "-60px" }}
              >
                <h2 className="mb-8 border-l-4 border-[var(--ink-gray-800)] pl-6 text-2xl font-bold uppercase tracking-wide text-[var(--ink-gray-300)]">
                  Studio Standards
                </h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {standards.map((s, i) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.3 + i * 0.06,
                        ease,
                      }}
                      viewport={{ once: true }}
                      className="flex flex-col gap-2"
                    >
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                        {s.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[var(--ink-gray-500)]">
                        {s.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* PARALLAX */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true }}
          className="group relative flex h-[40vh] w-full items-center justify-center overflow-hidden md:h-[60vh]"
        >
          <Image
            width={200}
            height={200}
            src="/images/yara-hero.jpeg"
            alt="UrizInk Artist"
            className="absolute inset-0 h-full w-full scale-105 object-contain brightness-90 contrast-125 grayscale transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-105 group-hover:contrast-110 group-hover:grayscale-0 lg:object-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-700 group-hover:opacity-70" />
          <div className="relative z-10 px-6 text-center transition-transform duration-700 group-hover:scale-[1.02]">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">
              Your Skin,
              <br /> My Canvas
            </h2>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center border-t border-[var(--ink-border)] py-24 px-6 text-center"
        >
          <p className="mb-6 text-sm font-bold uppercase tracking-widest text-[var(--ink-gray-500)]">
            Ready to start your project?
          </p>
          <Link href="/book">
            <motion.span
              className="inline-flex h-14 items-center justify-center border border-white px-10 text-base font-bold uppercase tracking-widest text-white hover:bg-white hover:text-black"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book an Appointment
            </motion.span>
          </Link>
        </motion.section>
    </div>
  );
}
