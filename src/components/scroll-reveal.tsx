"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  once?: boolean;
}

const offsets: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 60 },
  left: { x: -60, y: 0 },
  right: { x: 60, y: 0 },
  none: { x: 0, y: 0 },
};

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "0px 0px -60px 0px" });
  const offset = offsets[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
