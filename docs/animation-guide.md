# Animation Guide

## Library
Framer Motion (installed as `motion`). Import as `import { motion } from "motion/react"`.

## Reusable Components
- `src/components/scroll-reveal.tsx` — wraps any element with scroll-triggered spring reveal. Props: `direction` (up/left/right/none), `delay` (ms), `once` (boolean).
- `src/components/count-up.tsx` — animates a number from 0 to target with spring physics when scrolled into view.

## Spring Config
```ts
const spring = { type: "spring", stiffness: 120, damping: 18 };
```
Used consistently across all interactive elements.

## Patterns
- **Hero entrance:** staggered `initial/animate` with increasing delays (0.1, 0.2, 0.35, 0.5s)
- **Card hover:** `whileHover={{ scale: 1.03, y: -4 }}` with spring transition
- **Icon hover:** `whileHover={{ scale: 1.3, rotate: 10 }}` — playful twist
- **Button hover:** `whileHover={{ scale: 1.05, y: -4 }}` + `whileTap={{ scale: 0.97 }}`
- **Floating elements:** `animate={{ y: [0, -8, 0] }}` with `repeat: Infinity`
- **Progress bars:** `initial={{ width: "0%" }}` then animate to target

## Accessibility
`@media (prefers-reduced-motion: reduce)` in `globals.css` kills all CSS animations. Framer Motion respects this automatically via `useReducedMotion()` internally.

## Gotchas
- `motion.div` replaces `div` — all className/style props pass through.
- `ScrollReveal` uses `useInView` from motion — no manual IntersectionObserver needed.
- Spring animations don't have a fixed duration — `stiffness` and `damping` control feel.
- The `CountUp` component uses `useMotionValue` + `useTransform` for smooth rendering without re-renders.
