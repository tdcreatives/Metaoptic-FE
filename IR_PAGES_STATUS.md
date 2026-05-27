# Investor Relations — Pages & Data Status

All pages live under the `/investor-relations` route. Tab navigation at the top of every page.

**API provider:** B2i Technologies (BizID `3135`, API key `Po4Mk7Mi3`). Endpoints are CORS-enabled, fetched directly from the browser.

---

## Legend

- ✅ **Dynamic** — fetched live from B2I API
- 📁 **Static (JSON)** — data lives in a JSON file in the codebase, easy to edit
- 📝 **Hardcoded mock** — placeholder content, waiting on client data
- 🔧 **Form (handler TBD)** — UI complete, submission wired to console.log placeholder

---

## OVERVIEW — `/investor-relations`

Eight sections on a single page.

| # | Section | Status | Source / Notes |
|---|---|---|---|
| 1 | Corporate Overview | 📁 Static | Text hardcoded in component. |
| 2 | Recent Press Releases | ✅ Dynamic | B2I `LibraryFeed.asp`. Shows 3 latest items. |
| 3 | Most Recent Events | 📝 Mock | B2I CalView returns empty. 3 mock events. |
| 4 | Investor Presentation | 📝 Mock | Download PDF button → temp Google link. |
| 5 | Latest Financial Results | 📝 Mock | B2I FundamentalData returns empty. 4 mock rows + right placeholder image. |
| 6 | Stock Info | ✅ Dynamic | B2I `QuoteFeed.asp`. Values show `$0.00` until B2I activates quote service for MOT. |
| 7 | Email Alerts CTA | 📁 Static | Button links to `/resources/email-alerts`. |
| 8 | Investor Relations contacts | 📁 Static | Gateway Group + addresses hardcoded. |

---

## NEWS — `/investor-relations/news`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/news/press-releases` | ✅ Dynamic | B2I `LibraryFeed.asp` with year filter + pagination (6/page). |
| `/news/media` | 📁 Static | `src/constants/news.json` (29 entries with real images). Year filter + pagination. |

---

## EVENTS & PRESENTATION — `/investor-relations/events-and-presentation`

| Section | Status | Source / Notes |
|---|---|---|
| Investor Presentation | 📝 Mock | Same PDF download as Overview. |
| Upcoming Events | 📝 Mock | B2I CalView empty. 3 mock events with Webcast + Add to Calendar buttons. |
| Past Events | 📝 Mock | 3 mock events with Webcast + Audio buttons. |

---

## STOCK INFO — `/investor-relations/stock-info`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/stock-info/stock-quote` | ✅ Dynamic | 3 sections: **Stock Quote** (B2I QuoteApi Format 1), **Stock Chart** (B2I `ChartApi_20.asp` drop-in widget), **Detailed Information** (B2I QuoteApi Format 10 — Today + Share Information). |
| `/stock-info/analyst-coverage` | 📝 Mock | B2I AnalystApi empty. 6 mock firms (per meeting: hidden at launch). |

---

## FINANCIALS — `/investor-relations/financials`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/financials/sec-filings` | ✅ Dynamic | B2I `SecData2.asp`. Returns 6 real filings (F-1/A, F-1, DRS/A, DRS). Year + Group filter + pagination (10/page). |
| `/financials/quarterly-results` | 📝 Mock | B2I Pageapi requires admin setup. 2 mock years × 3 quarters × 3 items. |

---

## GOVERNANCE — `/investor-relations/governance`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/governance/documents-and-charters` | 📝 Mock | 6 mock document rows with Download PDF buttons. **Client to send real PDF files.** |
| `/governance/board-of-directors` | 📁 Static | `src/constants/board-of-directors.json` (7 directors, full bios). **Avatars are gray placeholders — client to send images.** |
| `/governance/management-team` | 📁 Static | `src/constants/management-team.json` (3 members). **Avatars are gray placeholders — client to send images.** |
| `/governance/committee-composition` | 📁 Static | `src/constants/committee-composition.json` (3 committees × 6 members with roles). |

---

## RESOURCES — `/investor-relations/resources`

| Sub-route | Status | Source / Notes |
|---|---|---|
| `/resources/investor-faqs` | 📁 Static | `src/constants/investor-faqs.json` (10 Q&A accordion). **6 answers populated, 4 awaiting client input** (incorporation, auditor, US legal counsel, SG legal counsel). |
| `/resources/email-alerts` | 🔧 Form (handler TBD) | UI complete (First/Last Name + Email + 3 preference checkboxes). **Submit handler is a placeholder** — needs to be wired to B2I Email Alert API or a backend endpoint. |
| `/resources/contact-us` | 🔧 Form (handler TBD) | UI complete (Send Us a Message form + Investor Relations contact block). **Submit handler is a placeholder.** |

---

## Action items — what we need from the client

| Page | What's needed |
|---|---|
| Overview / Investor Presentation | Real Investor Presentation PDF |
| Events page | List of upcoming events + PDF assets, OR B2I CalView setup |
| Stock Info | B2I to activate Quote service for symbol MOT (then values populate live) |
| Financials / Quarterly Results | Quarterly filing list + PDFs/links, OR B2I Pageapi setup |
| Governance / Documents & Charters | 6 PDF files (Audit Committee Charter, Nominating, Remuneration, Code of Ethics, Corporate Governance Guidelines, Insider Trading Policy) |
| Governance / Board of Directors | Headshot images for 7 directors |
| Governance / Management Team | Headshot images for 3 members |
| Resources / Investor FAQs | Answers for 4 outstanding questions (incorporation, independent auditor, US legal counsel, SG legal counsel) |
| Resources / Email Alerts | B2I Email Alert API activation OR a backend endpoint |
| Resources / Contact Us | A submission endpoint (B2I Contact API, web3forms, or a custom backend) |
| Overview / IR contacts | Confirm Gateway Group is the correct IR firm + verify email/phone |

---

## Environment variables

Located in `.env.local` (not committed) and `.env.example` (committed).

```
NEXT_PUBLIC_B2I_BIZ_ID=3135
NEXT_PUBLIC_B2I_API_KEY=Po4Mk7Mi3
NEXT_PUBLIC_B2I_SYMBOL=MOT
```
