Reset the database completely. This is destructive — confirm with the user before proceeding. Then run:
1. `npx prisma migrate reset --force` (drops all data and re-runs migrations)
2. `npx prisma db seed` (repopulates with sample data)

Report the result and remind the user that all custom data has been wiped.