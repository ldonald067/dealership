# Auth Patterns

## Setup
- NextAuth.js v5 with Credentials provider
- Config split: `src/lib/auth.config.ts` (edge-safe) + `src/lib/auth.ts` (server-only with Prisma)
- Middleware in `src/middleware.ts` handles route protection

## Roles
- `CUSTOMER` — redirects to `/dashboard`
- `DEALER` — redirects to `/dealer/dashboard`
- Role stored in `session.user.role`, set during sign-in via JWT callback

## Route Groups
- `(auth)` — login, register. Split layout with branded panel.
- `(customer)` — all customer pages. Sidebar nav + mobile hamburger.
- `(dealer)` — all dealer pages. Separate sidebar nav.

## Gotchas
- After registration, auto-sign-in via `signIn("credentials", { redirect: false })` then manual router push based on role.
- Session fetch after login: `fetch("/api/auth/session")` to get role for redirect — `signIn` result doesn't include role.
- Passwords hashed with bcrypt. Minimum 8 characters enforced client-side.
