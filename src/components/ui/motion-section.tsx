"use client";

import { motion, type Variants } from "framer-motion";

const defaultReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  variants?: Variants;
}

export function MotionSection({
  children,
  className = "",
  delay = 0,
  once = true,
  variants = defaultReveal,
}: MotionSectionProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

interface MotionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof motion;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function MotionReveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}: MotionRevealProps) {
  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={itemVariants}
      custom={delay}
      className={className}
    >
      {children}
    </Component>
  );
}
