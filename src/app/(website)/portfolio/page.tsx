"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const filters = ["All", "Fine Line", "Realism", "Micro-Realism", "Sleeve Work"] as const;

const images = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE3orpsrzzbj4G87ctoYX--3_BfTk1jJC6vK-Ajmmf73hZm9TvByylHQkm2PJtFNQ38sZnSWYzvrsmRbTzn9NaNK-8TvFc7pvkGhXWWLHUwBBfchF_6jm-ByoPEYl7Je8BO--nbA6lkEutDQzCyxeQTvL-rPSHVias5raFoGP3WOPEykidpwq9oaG566WZ7nXmGPd8yklLBAsPtMnJdSIa5FJsieF0DMi_nld-knzshXP8HlMPAsX_LtS6N61f68yW-qexOCuybhGa",
    tag: "Realistic Portrait",
    title: "Anatomy Study",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDMrx2ixw0_keT85S5fbsqKVbL0amQo2WmncppYTtrU3yLAhGM-4GS-dbnA9XAfop503CrPUCP1u_rFIiBaATVD3OiFhXiXzmNek5upcb7b_AwS328NlGvlgPkbqLaH7qpYjB9Ns2f2UHE16WjHC-QXwjZtHO5uWTduJM22kZZEHRu1J0CLc_gvXNwUES_WwofHw6q7m4TDekpmBSu1FlLsCjHakTmNORLyYDo5tSvz2PbJ7c_o4bb26AXLDeTSL_OosDv3ev5Kfx0a",
    tag: "Fine Line",
    title: "Minimalist Geometry",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtonC47fZBkJG40CdFY_zO6jSXgsR441kdo_DB3TSKTznBMV7vaMH3TCSqa0a_tkFTnXJ_mEJKuFL5bFhf9_Ob9nqgvx8Gb5N8tYkyeNVBS1KcunMr0iQ4vjvdKnaVQ7McNAJmd_YisCcIcPT_7tlaoSkzrzS1mgEe69IgzoHOYTbvuZ397gsfzveywgU1ixu1wCAOc5r8WrB8OSlQRNlsLQ99nSBwEezKXVfK4P1nqXU-qieKJCdmgs8_O9eQkVK7yb9bBf0YNknU",
    tag: "Micro-Realism",
    title: "Eye Detail",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-bMuoq6hctpzj6ILPpnF1wDdWZGbFAbdzdJKANniK2gEgvOxyGHU2RshzlSU-sq5nE7af0mgCZqqxLpFc86J3FHGlF5-UP8OT5NJKSSSTIg841sMi4BBerl3a6t7mhh95Xpymr2_bnsQckH9NDzxKDpEpvLbXqgunhN6vodNKiO_pcGZ-vCUM2gdBhpAL74w9KzEV09uXJWQLtgBJBiAclf-zpYeIHVQ_zr3AjJUmooBQV-kup9SS0opxCIdMenndfHIiW5buof44",
    tag: "Sleeve Work",
    title: "The Ancient Forest",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5Bpg2F8r1hMh7QY22R1o99x3SzgBD4XOx8YETfbcKG3QtqSQQo3ZmB77k9ZwhUMb6TTHmUN_gUGFIxTfAxjFLCGxWGKf_cPfLIlQGg6TQ7IkeRrXMladh84_zvg6pDuH8-mYb1qARyLYyRdUP_ZFiGxuSbXO9rh7IpZugCzhBNPMC5roQUqlQ35ZNBUloz2wt93P8DIkc9VcMQwY-ceUWwkv_KOaPEJ0URxbOfwqvNpRl2tDft6WQlZzqOWt5uMPJnPUc4DmDZFWN",
    tag: "Realism",
    title: "Lion Heart",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ1Ciy4obgKOZiYiTp03yIdLZOV4WQPIgqvrTPxGvPMCm-grQF0mtr-Xra1Ov3QT_vwARHgdfFJseJAd66XSi3YzHVC4-weMjPvROZfN2RQKTy6PJUEW32IkuRO-lVcmKysMzcs2WDTNw6FJPfgLSjlvmO8MdpJCysRMcIIbZrkJOgplJQYFG6N3kI08HBV9wYC7azLitKeIktl_IFZ940x5qgUOXpNpbCBSeeQr2-V_HUhlpEfJmecj1tKo-QPVRCIyavXuhemWDJ",
    tag: "Fine Line",
    title: "Celestial Constellation",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function Page() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex w-full flex-col items-center px-4 py-12 md:px-10">
        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <h1 className="mb-2 text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
              Portfolio
            </h1>
            <p className="mb-16 text-sm uppercase tracking-[0.3em] text-[var(--ink-gray-400)]">
              Black & Grey Specialists • Beirut, Lebanon
            </p>
          </motion.div>

          {/* FILTER BAR */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            className="mb-16 flex flex-wrap items-center gap-8 border-b border-[var(--ink-gray-800)] pb-2"
          >
            {filters.map((label, i) => (
              <motion.button
                key={label}
                type="button"
                onClick={() => setActiveFilter(label)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`relative pb-3 text-sm font-bold uppercase tracking-[0.2em] transition-colors ${
                  activeFilter === label
                    ? "text-white"
                    : "text-[var(--ink-gray-500)] hover:text-white"
                }`}
              >
                {label}
                {activeFilter === label && (
                  <motion.span
                    layoutId="portfolio-filter"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* GRID */}
          <div className="masonry-grid mx-auto max-w-6xl gap-6">
            {images.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.06,
                  ease,
                }}
                className="masonry-item group relative cursor-pointer overflow-hidden border border-[var(--ink-gray-800)] bg-[var(--ink-gray-900)] transition-colors duration-500 hover:border-white"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-black/40 p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-xs uppercase tracking-widest text-[var(--ink-gray-300)]">
                    {img.tag}
                  </p>
                  <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                    {img.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex justify-center py-20"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, backgroundColor: "white", color: "black" }}
              whileTap={{ scale: 0.98 }}
              className="border border-white px-10 py-4 font-black uppercase tracking-widest text-white transition-colors duration-500 hover:bg-white hover:text-black"
            >
              Load More Projects
            </motion.button>
          </motion.div>
        </div>
    </div>
  );
}
