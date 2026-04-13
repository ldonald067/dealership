# Dealership Appointment Workflow

A web app that lets car buyers complete everything online so the dealership visit is just: test drive, sign, drive away.

## Stack
- **Next.js 14** (App Router, TypeScript) — single app, two portals via route groups
- **Prisma + SQLite** — database ORM, schema in `prisma/schema.prisma`
- **NextAuth.js v5** — credentials auth with role-based access (CUSTOMER / DEALER)
- **Tailwind CSS + shadcn/ui** — warm, colorful, inviting design
- **Zod + React Hook Form** — validation shared between client and server

## Essential Commands
```bash
npm run dev          # start dev server at localhost:3000
npx prisma studio   # visual database browser at localhost:5555
npx prisma migrate dev --name <name>  # run migrations
npx prisma db seed   # seed sample data
```

## Architecture
- `src/app/(auth)/` — login, register
- `src/app/(customer)/` — customer portal (browse, upload, credit, book)
- `src/app/(dealer)/` — dealer portal (review, inventory, calendar)
- `src/app/api/` — REST endpoints
- `src/lib/` — shared utilities (auth, prisma, validations, lease math)

## IMPORTANT: Read relevant docs before starting any task
- `docs/` — domain-specific gotchas and patterns per feature area
- `.claude/agents/` — specialized agents for complex domains
- `docs/design-system.md` — UI/UX guidelines and design direction
