"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="w-full border-t border-[var(--ink-border)] py-12 text-center"
    >
      <p className="text-sm uppercase tracking-wider text-[var(--ink-gray-600)]">
        © 2026 UrizInk. All rights reserved.
      </p>
    </motion.footer>
  );
}
