# API Patterns

## Convention
All APIs are in `src/app/api/`. Each uses `auth()` from `@/lib/auth` to verify session.

## Customer APIs
- `GET /api/vehicles` — list vehicles, optional `bodyType` and `fuelType` query params
- `GET /api/vehicles/[id]` — single vehicle with dealership info
- `GET/POST /api/documents` — list user's docs / upload (FormData with `file` + `type`)
- `GET/POST /api/credit` — list user's credit apps / submit new application
- `GET/POST /api/appointments` — list user's appointments / book new one
- `GET /api/appointments/slots?date=YYYY-MM-DD&dealershipId=X` — available time slots
- `GET /api/status` — aggregated progress (docs, credit, appointments)

## Dealer APIs
- `GET/PATCH /api/dealer/applications` — list all apps with user data / approve or deny
- `GET/PATCH /api/dealer/appointments` — list dealership appointments / confirm, cancel, complete
- `PATCH /api/dealer/documents` — update document status and review note

## Gotchas
- Vehicle API returns `dealership: { id, name, city, state }` — the `id` is needed for appointment booking.
- Document upload uses `formData.get("file")` — file stored as base64 in DB (SQLite, no S3).
- Credit application POST expects flat JSON body, not FormData.
- Appointment slots: hardcoded 9am-5pm hourly slots minus already-booked times.
