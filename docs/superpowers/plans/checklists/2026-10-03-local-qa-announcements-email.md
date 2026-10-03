# Local QA — Announcements API + Email Alerts (3 Oct 2026)

**Shepherd:** `.cursor/rules/project-shepherd.mdc`  
**Env:** FE `http://localhost:4444` · BE `http://localhost:8080`  
**Flags (must be true for this run):** `useAnnouncementsApi` · `showEmailAlerts`  
**Results file:** `.superpowers/sdd/qa-2026-10-03-results.md`

Agents mark each item **PASS / FAIL / BLOCKED** with evidence (HTTP status, snippet, screenshot path). Do not flip flags off during the run.

---

## Preconditions

- [ ] **P1** BE up: `GET http://localhost:8080/api/announcements?page=1&page_size=1` → 200 JSON `{ data, meta }`
- [ ] **P2** FE up: `GET http://localhost:4444/investor-relations/company-announcement` → 200
- [ ] **P3** Flags: `useAnnouncementsApi: true` and `showEmailAlerts: true` in `src/constants/ir-feature-flags.js`
- [ ] **P4** CORS: request with `Origin: http://localhost:4444` gets `Access-Control-Allow-Origin: http://localhost:4444`

---

## Feature A — Company Announcements (API + FE)

- [ ] **A1** List API shape: `data[]` items have Presenter keys `id, title, slug, desc, date, details, category` (plus layout titles). No `source_payload` / `needs_review`.
- [ ] **A2** `meta.total` ≥ 1 and `page_size` respected (request `page_size=2` → `data.length` ≤ 2).
- [ ] **A3** Detail API: pick a slug from list → `GET /api/announcements/{slug}` → 200 with same shape; unknown slug → 404 `{ error: not_found }`.
- [ ] **A4** Filter: `?category=` (use a real category from list) returns only that category (or empty if none).
- [ ] **A5** FE list page HTML loads (200). Client bundle references `/api/announcements` or `fetchAnnouncementList` path (source/build check OK if Network not available).
- [ ] **A6** FE detail: open `/investor-relations/company-announcement/{slug}` for a published slug → 200 (not empty error shell).
- [ ] **A7** API-down fallback: (optional) stop BE briefly → FE still renders without leaking internal fields (or documents catch → JSON fallback). Skip if cannot stop BE safely → **BLOCKED** with note.

---

## Feature B — Email Alerts (public)

- [ ] **B1** Nav: RESOURCES sub-nav includes **Email Alerts** linking to `/investor-relations/resources/email-alerts`.
- [ ] **B2** Page not redirected: `GET /investor-relations/resources/email-alerts` → 200 and body contains Email Alerts form (not Investor FAQs-only redirect).
- [ ] **B3** Subscribe happy path: `POST /api/subscribers` JSON `{ "email":"qa+local@example.test", "first_name":"QA", "last_name":"Local", "categories":["General Announcement"], "website":"" }` → 200 `{ "ok": true }` (or documented success).
- [ ] **B4** Honeypot: same POST with `"website":"http://spam.test"` → 200 ok-shaped response and **no** new subscriber for that spam path (or no mail). Evidence via DB/log if available; else API still returns ok without error leak.
- [ ] **B5** Invalid email still non-enumerating (200 ok / no stack trace) per product rules.
- [ ] **B6** Unsubscribe endpoint exists: `POST /api/unsubscribe` with bogus token does not 500 (4xx/200 ok per API contract).
- [ ] **B7** Form UI: page shows email + category checkboxes + submit (HTML contains preference labels or category strings).

---

## Sign-off

- [x] **S1** All P* PASS
- [x] **S2** Feature A critical path A1–A6 PASS (A7 optional) — A6 fixed (`announcementStaticParamsFrom`)
- [x] **S3** Feature B critical path B1–B3, B7 PASS
- [x] **S4** Results written to `.superpowers/sdd/qa-2026-10-03-results.md`

**Last run:** 3 Oct 2026 — details in `.superpowers/sdd/qa-2026-10-03-results.md`
