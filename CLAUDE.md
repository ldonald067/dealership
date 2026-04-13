# Dealership Appointment Workflow

A web app that lets car buyers complete everything online so the dealership visit is just: test drive, sign, drive away.

## Stack
- **Next.js 14** (App Router, TypeScript) — single app, two portals via route groups
- **Prisma v7 + SQLite** — `@prisma/adapter-libsql`, schema in `prisma/schema.prisma`
- **NextAuth.js v5** — credentials auth, roles: CUSTOMER / DEALER
- **Tailwind CSS + shadcn/ui** — teal-800/orange-500 palette, no gradients
- **Framer Motion** — spring animations, scroll reveals, hover effects
- **Zod + React Hook Form** — validation shared between client and server

## Essential Commands
```bash
npm run dev          # start dev server at localhost:3000
npx prisma studio   # visual database browser at localhost:5555
npx prisma migrate dev --name <name>  # run migrations
npx prisma db seed   # seed sample data
```

## Architecture
- `src/app/(auth)/` — login, register (split layout with branded panel)
- `src/app/(customer)/` — customer portal (browse, upload, credit, book)
- `src/app/(dealer)/` — dealer portal (review, inventory, calendar)
- `src/app/api/` — REST endpoints
- `src/lib/` — shared utilities (auth, prisma, validations, lease math)
- `src/components/` — scroll-reveal, count-up, confirm-dialog, shadcn/ui

## IMPORTANT: Read relevant docs before starting any task
- `docs/design-system.md` — colors, typography, animation config, layout rules
- `docs/prisma-gotchas.md` — SQLite adapter, import paths, singleton caching
- `docs/auth-patterns.md` — roles, redirects, session handling
- `docs/api-patterns.md` — endpoint conventions, request/response formats
- `docs/animation-guide.md` — Framer Motion patterns, spring config, components
- `.claude/agents/` — specialized agents for UI/UX and database tasks
