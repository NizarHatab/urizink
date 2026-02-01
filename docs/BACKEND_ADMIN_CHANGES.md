# Backend & Admin – Current State & Required Changes

## 1. Current State Summary

| Area | Status | Notes |
|------|--------|------|
| **Bookings** | ✅ Backend + Admin wired | API GET/POST, DB schema, service, admin page fetches real data |
| **Reviews** | ❌ Mock only | DB schema exists, no API, admin uses hardcoded array |
| **Portfolio** | ❌ Mock only | DB schema exists, no API, admin uses hardcoded array |
| **Schedule** | ❌ Mock only | DB schema exists, no API, admin uses static calendar |
| **Dashboard** | ❌ Mock only | Stat cards and activity/schedule are hardcoded |
| **Auth** | ❌ None | No login; admin is open to anyone |

---

## 2. Backend (API + DB + Services)

### 2.1 What Exists

**Database (Drizzle)**
- `users` – id, email, firstName, lastName, phone, passwordHash, isAdmin, createdAt
- `artists` – id, name, specialty, createdAt
- `bookings` – id, userId, description, placement, size, artistId, scheduledAt, status, createdAt
- `reviews` – id, userId, artistId, rating, comment, createdAt
- `portfolio` – id, artistId, title, imageUrl, style, tags[], createdAt
- `schedule` – id, artistId, startTime, endTime, status (available | booked | blocked), createdAt

**API routes**
- `POST /api/bookings` – create booking (validates, creates user if needed, inserts booking)
- `GET /api/bookings` – list all bookings (joined with users for name/email/phone)
- `GET /api/health/db` – DB ping

**Services**
- `booking.service.ts` – createBooking, getBookings (with user join)
- `user.service.ts` – findOrCreateUser (used by booking)

### 2.2 API Response Shape Mismatch (Bookings)

- **Backend GET** returns: `NextResponse.json(bookings)` where `bookings = getBookings()` → `{ success: true, data: Booking[] }`.
- **Client** does: `response.json().then(data => data.data)` → expects top-level `data`. So it expects the **whole response body** to be `{ data: [...] }` or the handler to return `bookings` (the object with `success` and `data`).  
- **Fix:** Keep returning `NextResponse.json(bookings)` (the full `{ success, data }`). Client already does `data.data`; just ensure the API never returns the array only (e.g. `NextResponse.json(data)`). Currently it’s correct.

---

## 3. Admin Frontend – What’s Real vs Mock

### 3.1 Bookings (`/admin/bookings`) – REAL

- Fetches from `GET /api/bookings`.
- Displays: client (name, email), description, placement/size, artistId, date/time, status.
- **Missing / to improve:**
  - Filter buttons (All, Pending, Upcoming, Completed) do nothing – need to filter by `status` and `scheduledAt`.
  - No update status (e.g. Pending → Confirmed) – need `PATCH /api/bookings/[id]` and UI.
  - No row actions (reschedule, cancel, assign artist) – need API + UI.
  - “More Filters” does nothing.

### 3.2 Dashboard (`/admin`) – MOCK

- **Stat cards:** “12”, “4.9/5”, “8” are hardcoded.
- **Recent Activity:** Hardcoded list (bookings, reviews, deposits).
- **Today’s Schedule:** Hardcoded list.
- **Needed:**
  - Stats from DB: count pending bookings, avg rating from reviews, count new reviews (e.g. last 7 days).
  - Recent activity from bookings (and optionally reviews) ordered by createdAt.
  - Today’s schedule from `bookings` where `scheduledAt` is today (and optionally from `schedule` if you use it for slots).

### 3.3 Reviews (`/admin/reviews`) – MOCK

- **ReviewsList** (and likely stats/distribution/monthly) use a hardcoded array.
- **Needed:**
  - `GET /api/reviews` – list reviews (join users for name, artists for artist name).
  - Admin components to fetch and display real reviews; stats (avg rating, distribution, volume) from same API or aggregated endpoints.

### 3.4 Portfolio (`/admin/portfolio`) – MOCK

- **PortfolioGrid** uses a hardcoded `tattoos` array.
- **Needed:**
  - `GET /api/portfolio` – list portfolio items (join artists).
  - `POST /api/portfolio` – create (title, imageUrl, style, tags, artistId).
  - `DELETE /api/portfolio/[id]` (and optionally PATCH for edit).
  - Image upload: either upload to storage (e.g. S3/Vercel Blob) and save URL, or paste URL for now.
  - Admin: replace mock array with API data; wire upload/add form.

### 3.5 Schedule (`/admin/schedule`) – MOCK

- **CalendarGrid** and **TimeRow** are static (fake days/times).
- **Needed:**
  - Decide model: either (1) slots in `schedule` (available/booked/blocked) or (2) derive from `bookings.scheduledAt` (and maybe artists).
  - `GET /api/schedule` – by week and optionally artist (query params).
  - Optionally `PATCH /api/schedule/[id]` to block/unblock, or create bookings that “fill” slots.
  - Admin: load real slots/bookings and show in calendar; allow creating blocks or viewing bookings per day.

---

## 4. Recommended Change List (Prioritised)

### Phase 1 – Fix & complete Bookings

1. **API**
   - Add `PATCH /api/bookings/[id]` to update `status` (and optionally `scheduledAt`, `artistId`).
   - Optionally add query params to `GET /api/bookings` (e.g. `?status=pending&from=...&to=...`).

2. **Admin**
   - Wire filter buttons to filter by status (and optionally date range).
   - Add row action: change status (dropdown or buttons: Confirm, Complete, Cancel).
   - Optionally: assign artist (dropdown of artists from DB).

### Phase 2 – Dashboard real data

1. **API**
   - Add `GET /api/admin/stats` (or separate endpoints) for: pending bookings count, average rating, new reviews count, recent bookings, today’s bookings.

2. **Admin**
   - Dashboard fetches stats and recent activity; “Today’s Schedule” from today’s bookings (and optionally schedule table).

### Phase 3 – Reviews

1. **API**
   - `GET /api/reviews` with optional filters (artist, date range); join users + artists.
   - Optionally `POST /api/reviews` (if you allow creating reviews from admin).

2. **Services**
   - `review.service.ts` – getReviews, optionally createReview.

3. **Admin**
   - Replace mock in ReviewsList, RatingDistribution, MonthlyVolume, StatsCards with API data.

### Phase 4 – Portfolio

1. **API**
   - `GET /api/portfolio`, `POST /api/portfolio`, `DELETE /api/portfolio/[id]`, optionally `PATCH /api/portfolio/[id]`.
   - If you want file upload: endpoint that uploads to storage and returns URL, then POST that URL to portfolio.

2. **Services**
   - `portfolio.service.ts` – CRUD.

3. **Admin**
   - Portfolio grid from API; upload/add form; delete (and edit) actions.

### Phase 5 – Schedule

1. **API**
   - `GET /api/schedule?week=...&artistId=...` (and optionally `GET /api/bookings?from=...&to=...` for calendar view).
   - If using schedule table: `PATCH /api/schedule/[id]` for block/unblock.

2. **Admin**
   - Calendar built from real slots and/or bookings; week navigation; optional artist filter.

### Phase 6 – Auth (recommended before or with Phase 2)

1. **Backend**
   - Use NextAuth.js (or similar) with credentials or OAuth.
   - Protect `/api/*` admin routes and optionally `/admin/*` pages (middleware or getServerSession).

2. **Admin**
   - Login page; redirect to login when unauthenticated; logout.

---

## 5. Small Fixes (Do Anytime)

- **Bookings GET client:** Ensure it handles both `{ data: [...] }` and error shape consistently (already expects `response.data` from full body).
- **Admin layout:** Ensure `Content-Type: application/json` for POST/PATCH requests in `lib/api` if not set.
- **Types:** Export shared types (e.g. Review, PortfolioItem) from `types/` and use in API + admin.
- **Artists:** If admin shows “Artist”, ensure artists exist in DB and are loaded (e.g. `GET /api/artists`) for dropdowns.

---

## 6. Summary Table

| Feature | API | Service | Admin data | Suggested next step |
|--------|-----|---------|------------|----------------------|
| Bookings list | ✅ GET | ✅ | ✅ Real | Add PATCH + filters + status actions |
| Bookings create | ✅ POST | ✅ | (website form) | — |
| Dashboard stats | ❌ | ❌ | Mock | Add stats API + wire dashboard |
| Reviews | ❌ | ❌ | Mock | Add GET /api/reviews + service + wire admin |
| Portfolio | ❌ | ❌ | Mock | Add CRUD API + service + wire admin + upload |
| Schedule | ❌ | ❌ | Mock | Define model, add GET (and PATCH) + wire calendar |
| Auth | ❌ | — | None | Add NextAuth + protect admin & API |

If you tell me which phase you want to tackle first (e.g. “Phase 1 bookings” or “Phase 6 auth”), I can outline concrete steps and code changes file-by-file.
