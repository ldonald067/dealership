# Design System & UX Direction

## Vibe
Fun, warm, premium, human — NOT generic SaaS or AI-generated looking. Primary layout inspiration: **dave.com** — alternating asymmetric sections, compact spacing, natural content flow without labels/badges on every section.

## Color Palette
- **Primary 1 (action):** orange-500 — CTAs, active states, progress
- **Primary 2 (depth):** teal-800 — headings, dark sections, nav buttons
- **Secondary accent:** cyan-300/teal-600 — timestamps, secondary icons, light tints
- **Backgrounds:** amber-50 (hero), white (content), gray-50 (alternate), cyan-50 (feature cards)
- **NO GRADIENTS** — bold solid colors + motion instead. Gradients look AI-generated.

## Illustrations
4 custom hand-drawn crayon-style illustrations, each with default + hover state:
- **Car** (car1/car2) — Browse vehicles. Hover: car drifts with smoke.
- **Folder** (folder1/folder2) — Upload documents. Hover: folder opens with docs.
- **Bank** (bank1/bank2) — Credit approval. Hover: doors open with golden light.
- **Calendar** (calendar1/calendar2) — Book appointment. Hover: pages fill in.

Stored in `public/illustrations/`. Used via `HoverIllustration` component (spring swap on hover, tap toggle on mobile). Each illustration appears ONCE in its landing page feature section + small (64px) in portal card icons and customer page headers.

## Typography
- Hero h1: `text-5xl sm:text-6xl md:text-7xl font-black text-teal-800`
- Feature h2: `text-3xl md:text-4xl font-black text-teal-800` (smaller than hero — creates hierarchy)
- CTA h2: `text-4xl md:text-6xl font-black text-white`
- Page titles in portals: `text-2xl font-bold text-teal-800`
- Body: `text-gray-500` / `text-gray-600`
- Labels/overlines: `text-sm font-bold text-orange-500 uppercase tracking-[0.2em]` — use sparingly (hero only), NOT on every section

## Animation (Framer Motion)
- Spring config: `{ type: "spring", stiffness: 120, damping: 18 }`
- Scroll reveals: `ScrollReveal` component wraps sections (spring-based IntersectionObserver)
- Hover: `whileHover={{ scale: 1.02, y: -3 }}` on cards, `rotate: 10` on icons
- Buttons: `whileHover={{ scale: 1.05, y: -4 }}` + `whileTap={{ scale: 0.97 }}`
- Illustration swap: `AnimatePresence mode="wait"` with spring scale transition
- Counting numbers: `CountUp` component for stats
- Arrow micro-interaction: `→` shifts right on hover via `group-hover:translate-x-1`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` kills all animations

## Component Patterns
- Rounded corners: `rounded-2xl` (cards), `rounded-xl` (inputs/buttons), `rounded-full` (pills)
- Cards: white bg, `border-2 border-gray-100`, `hover:border-orange-200`, spring hover
- Buttons: solid bg (orange-500 or teal-800), `shadow-lg`, `rounded-2xl`, `font-bold`
- Inputs: `rounded-xl`, `border-gray-200`, `focus:border-orange-400 focus:ring-2 focus:ring-orange-100`
- Focus: `focus-visible` orange outline for keyboard nav
- `HoverIllustration`: reusable component for image swap on hover with spring animation

## Layout Principles (Dave.com patterns)
- **Alternating 50/50 grids** — image-left/text-right, then flipped each section
- **Compact padding** — `py-16 md:py-24` on feature sections, NOT bloated `py-40`
- **No step badges** — content flows naturally, no "Step 1 of 4" indicators
- **No labels on every section** — uppercase overlines only where they add value (hero)
- **Variable heading sizes** — hero biggest, features smaller, CTA medium — creates hierarchy
- **Color blocking** — distinct background per section (white → amber-50 → white → cyan-50)
- **One CTA, not four** — feature sections describe, final CTA section converts

## Portal Differences
- **Customer portal:** warm amber-50 bg, orange active states, guided journey
- **Dealer portal:** functional dashboard, same color palette, more data-dense
- **Landing page:** full-bleed sections, spring animations, scroll reveals, illustration hover swap
- **Auth pages:** split layout (teal branded panel + form) on desktop, stacked on mobile
- **Page headers:** small illustration (64px) next to h1 on each customer page
- **Dashboard steps:** illustration icons replace emojis, completed = active/hover state
