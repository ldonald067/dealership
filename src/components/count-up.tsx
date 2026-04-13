"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

interface CountUpProps {
  target: number;
  className?: string;
  duration?: number;
}

export function CountUp({ target, className = "", duration = 1.2 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (isInView) {
      animate(count, target, {
        duration,
        type: "spring",
        stiffness: 50,
        damping: 15,
      });
    }
  }, [isInView, target, count, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
