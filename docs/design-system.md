# Design System & UX Direction

## Vibe
Fun, warm, premium, human — NOT generic SaaS or AI-generated looking. Inspired by discord.com and dave.com: asymmetric layouts, bold color blocking, personality-driven copy.

## Color Palette
- **Primary 1 (action):** orange-500 — CTAs, active states, progress
- **Primary 2 (depth):** teal-800 — headings, dark sections, nav buttons
- **Secondary accent:** cyan-300/teal-600 — timestamps, secondary icons, light tints
- **Backgrounds:** amber-50 (hero), white (content), gray-50 (alternate), cyan-50 (feature cards)
- **NO GRADIENTS** — bold solid colors + motion instead. Gradients look AI-generated.

## Typography
- Headings: `font-black text-teal-800` (on light bg), `font-black text-white` (on dark bg)
- Page titles in customer/dealer portals: `text-2xl font-bold text-teal-800`
- Body: `text-gray-500` / `text-gray-600`
- Labels/overlines: `text-sm font-bold text-orange-500 uppercase tracking-[0.2em]`

## Animation (Framer Motion)
- Spring config: `{ type: "spring", stiffness: 120, damping: 18 }`
- Scroll reveals: `ScrollReveal` component wraps sections (spring-based IntersectionObserver)
- Hover: `whileHover={{ scale: 1.03, y: -4 }}` on cards, `rotate: 10` on icons
- Buttons: `whileHover={{ scale: 1.05, y: -4 }}` + `whileTap={{ scale: 0.97 }}`
- Counting numbers: `CountUp` component for stats
- Arrow micro-interaction: `→` shifts right on hover via `group-hover:translate-x-1`
- Reduced motion: `@media (prefers-reduced-motion: reduce)` kills all animations

## Component Patterns
- Rounded corners: `rounded-2xl` (cards), `rounded-xl` (inputs/buttons), `rounded-full` (pills)
- Cards: white bg, `border-2 border-gray-100`, `hover:border-orange-200`, spring hover
- Buttons: solid bg (orange-500 or teal-800), `shadow-lg`, `rounded-2xl`, `font-bold`
- Inputs: `rounded-xl`, `border-gray-200`, `focus:border-orange-400 focus:ring-2 focus:ring-orange-100`
- Focus: `focus-visible` orange outline for keyboard nav

## Layout Principles (Anti-AI patterns)
- **Asymmetric grids** — text 3/5, visual 2/5 (not centered everything)
- **Alternating layouts** — text-left/visual-right, then flipped (Discord pattern)
- **Variable section padding** — not uniform heights
- **Color blocking** — distinct background per section (Dave pattern)
- **No centered-text-then-card-grid** — the most AI-looking pattern

## Portal Differences
- **Customer portal:** warm amber-50 bg, orange active states, guided journey
- **Dealer portal:** functional dashboard, same color palette, more data-dense
- **Landing page:** full-bleed sections, spring animations, scroll reveals
- **Auth pages:** split layout (teal branded panel + form) on desktop, stacked on mobile
