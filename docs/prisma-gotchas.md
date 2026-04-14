# Prisma Gotchas

## SQLite adapter path (Prisma v7)
Prisma v7 requires a driver adapter — we use `@prisma/adapter-libsql`.
The DB file is at the project root (`dev.db`), NOT in `prisma/dev.db`.
Use `path.join(process.cwd(), "dev.db")` for the adapter URL.
**Fix:** See `src/lib/prisma.ts` for the correct setup.

## PrismaClient constructor
Prisma v7 requires an `options` argument with an `adapter` — `new PrismaClient({})` won't work.

## PrismaLibSql casing
The export is `PrismaLibSql` (lowercase 'ql'), NOT `PrismaLibSQL`.

## Generated client import path
Import from `@/generated/prisma/client` (not `@/generated/prisma` — there's no index file).

## Singleton caching
The global singleton caches the Prisma client. If you change the DB path, you must restart the dev server — hot reload won't pick up the new connection.
