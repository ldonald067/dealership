"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const spring = { type: "spring" as const, stiffness: 120, damping: 18 };

interface HoverIllustrationProps {
  defaultSrc: string;
  hoverSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  float?: boolean;
}

export function HoverIllustration({
  defaultSrc,
  hoverSrc,
  alt,
  width,
  height,
  className = "",
  float = false,
}: HoverIllustrationProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onTouchStart={() => setHovered((h) => !h)}
      animate={float && !hovered ? { y: [0, -8, 0] } : undefined}
      transition={
        float && !hovered
          ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
          : undefined
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={hovered ? "active" : "default"}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.06 }}
          transition={spring}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hovered ? hoverSrc : defaultSrc}
            alt={alt}
            width={width}
            height={height}
            className="select-none pointer-events-none"
          />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
