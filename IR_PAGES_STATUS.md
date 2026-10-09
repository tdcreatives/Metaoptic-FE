# Investor Relations — Pages & Data Status

**Release status (16 Sep 2026):** The confirmed IR UI consolidation is implemented and locally verified. The public IR navigation has six tabs:

**Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance → Resources**

All canonical IR pages live under `/investor-relations`. The current announcement dataset is static (`src/constants/announcements.json`). Automatic SGX synchronization and the Email Alerts subscription/delivery backend are deferred follow-up projects and are **not implemented** in this release.

---

## Legend

- ✅ **Complete** — included in the current UI release
- 📁 **Static** — content is stored in the codebase; no automatic synchronization
- 🙈 **Hidden** — implementation is retained but not exposed at launch
- ⏳ **Deferred** — planned follow-up; not implemented

---

## OVERVIEW — `/investor-relations`

Launch sections on a single page.

| Section | Status | Source / Notes |
|---|---|---|
| Corporate Overview | ✅ Complete | Static company copy retained. |
| Investor Presentation | ✅ Complete | Uses `MOT-Company-Presentation-Sep2026.pdf`. |
| Investor Relations contacts | ✅ Complete | Two columns: Headquarters and Depository Bank. Gateway Group content removed. |
| Recent Press Releases | ✅ Removed | Confirmed alignment choice. |
| Email Alerts CTA | 🙈 Hidden | Backend is deferred; no launch entry point is shown. |
| Mock event/financial/stock sections | 🙈 Hidden | Not part of the confirmed launch surface. |

---

## EVENTS & PRESENTATION — `/investor-relations/events-and-presentation`

| Section | Status | Source / Notes |
|---|---|---|
| Investor Presentation | ✅ Complete | Uses `MOT-Company-Presentation-Sep2026.pdf`; the three existing whitepapers are retained. |
| Upcoming Events | 🙈 Hidden | Not launch-ready. |
| Past Events | 🙈 Hidden | Not launch-ready. |

---

## SGX COMPANY ANNOUNCEMENT — `/investor-relations/company-announcement`

| Route / content | Status | Source / Notes |
|---|---|---|
| Announcement list | 📁 Static | Current data remains in `src/constants/announcements.json`; search, filters and pagination are retained. |
| `/investor-relations/company-announcement/[slug]` | ✅ Complete | Canonical nested detail route generated for every static announcement slug. |
| “MetaOptics Ltd SGX Listing” video | ✅ Complete | Retained per confirmation. |
| Extra News block | ✅ Removed | Confirmed alignment choice. |
| Automatic SGX synchronization | ⏳ Deferred | Requires the separately scoped session-aware backend, persistence/cache, cron, deduplication and monitoring. |

---

## ANALYST COVERAGE — `/investor-relations/analyst-coverage`

| Content | Status | Source / Notes |
|---|---|---|
| Existing SGX analyst firms, disclaimer and video | ✅ Complete | Wrapped in the shared IR banner and six-tab navigation. |

---

## GOVERNANCE — `/investor-relations/governance`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/governance/documents-and-charters` | 🙈 Hidden | Existing placeholder implementation retained but not launch-ready. |
| `/governance/board-of-directors` | 📁 Static | `src/constants/board-of-directors.json` (7 directors, full bios). **Avatars are gray placeholders — client to send images.** |
| `/governance/management-team` | 📁 Static | `src/constants/management-team.json` (3 members). **Avatars are gray placeholders — client to send images.** |
| `/governance/committee-composition` | 📁 Static | `src/constants/committee-composition.json` (3 committees × 6 members with roles). |

---

## RESOURCES — `/investor-relations/resources`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/resources/investor-faqs` | 📁 Static | SGX-only current-listing wording: MetaOptics Ltd is listed on SGX under stock code `9MT`. Nasdaq is planned for a future phase and is not presented as a current listing. |
| `/resources/contact-us` | ✅ Complete | Gateway Group content removed; existing general contact delivery is retained. |
| `/resources/email-alerts` | 🙈 Hidden / ⏳ Deferred | Direct requests redirect to Investor FAQs. Existing UI code is retained, but subscriber storage, double opt-in, unsubscribe and announcement-triggered delivery are not implemented. |

---

## Confirmed alignment decisions

All seven questions from the 15 Sep requirements review were confirmed with the recommended answers:

1. Remove the global IR header dropdown and link directly to `/investor-relations`.
2. Keep Governance and Resources as separate tabs.
3. Remove the entire IR News tab; do not migrate Media.
4. Replace Financials in navigation with SGX Company Announcement; remove SEC/Quarterly from public IR navigation, retain the SGX listing video and announcements table, and remove the extra News block.
5. Use the existing SGX Analyst Coverage experience inside the IR chrome.
6. Add permanent redirects for legacy URLs; update only the Investor Presentation PDF and retain the three whitepapers.
7. **SGX only for now; Nasdaq is planned for a future phase.**

## Final route and redirect inventory

Canonical routes:

- `/investor-relations`
- `/investor-relations/events-and-presentation`
- `/investor-relations/company-announcement`
- `/investor-relations/company-announcement/[slug]`
- `/investor-relations/analyst-coverage`
- `/investor-relations/governance` and its retained visible sub-routes
- `/investor-relations/resources`, `/investor-relations/resources/investor-faqs`, and `/investor-relations/resources/contact-us`

Legacy Company Announcement, Analyst Coverage, Financials, IR News, Email Alerts and Stock Info URLs have one-hop permanent redirect rules in Next.js and Apache configuration. Local static checks verify rule coverage and guard against redirecting canonical `/investor-relations`; live Apache behavior still requires verification against an actual Apache staging endpoint.

## Deferred follow-up work

1. **SGX Company Announcements Sync:** session-aware SGX retrieval, cron, persistence/cache, deduplication, monitoring and frontend data-source replacement.
2. **Email Alerts Backend:** subscriber storage, double opt-in, unsubscribe, provider integration, announcement-triggered delivery, retries and send deduplication.

Neither backend feature is implemented or required for this UI release.

## Remaining content inputs

| Page | What's needed |
|---|---|
| Events page | List of upcoming events + PDF assets, OR B2I CalView setup |
| Governance / Documents & Charters | 6 PDF files (Audit Committee Charter, Nominating, Remuneration, Code of Ethics, Corporate Governance Guidelines, Insider Trading Policy) |
| Governance / Board of Directors | Headshot images for 7 directors |
| Governance / Management Team | Headshot images for 3 members |
