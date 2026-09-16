# Investor Relations — Meeting Requirements

**Meeting:** 15 Sep 2026 · TDC Marketing × Tâm  
**Source:** Meeting transcription  
**Scope:** IR UI/content updates followed by an SGX announcements mirror and automated Email Alerts backend.

## Confirmed release status — 16 Sep 2026

All seven IR UI alignment questions in §6 were confirmed with the recommended answers. The UI release is implemented with six tabs: **Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance → Resources**.

- The global IR header dropdown is removed.
- News and Financials are removed from public IR navigation.
- Company Announcement and Analyst Coverage use canonical nested IR routes, including `/investor-relations/company-announcement/[slug]`.
- The updated presentation is used in both requested locations; the three whitepapers are retained.
- Recent Press Releases, Gateway Group content and launch entry points to Email Alerts are removed/hidden.
- Legacy URL redirects are configured.
- **Listing alignment: SGX only for now; Nasdaq is planned for a future phase.**
- Announcements currently use the static `src/constants/announcements.json` dataset.
- **Deferred, not implemented:** automatic SGX synchronization and the Email Alerts subscriber/delivery backend.

---

## 1. Summary of requested updates

### Navigation & information architecture

| # | Request | Intent |
|---|---------|--------|
| 1 | Remove the Investor Relations **header dropdown** | Clicking **INVESTOR RELATIONS** should land on the IR Overview page (no submenu). |
| 2 | Combine the previous SGX / NASDAQ-style surfaces into one IR experience | Standalone Company Announcements and Analyst Coverage should live inside the IR tab chrome. |
| 3 | Reorder IR tabs after the change | **Overview → Events & Presentation → SGX Company Announcement → Analyst Coverage → Governance and Resources** |
| 4 | Remove the **News** tab/section | Content is being combined elsewhere; keep only sections TDC explicitly wants retained. |
| 5 | Replace the entire **Financials** tab with **SGX Company Announcement** | Use the existing ASAP / company-announcement page implementation as the new tab content. |
| 6 | Keep remaining sections not called out for removal | Do not change Governance / Resources content except where Gateway Group or Email Alerts are involved. |

### Overview page

| # | Request | Intent |
|---|---------|--------|
| 7 | Remove **Recent Press Releases** on Overview | Redundant after News is combined / removed. |
| 8 | Remove the middle **Investor Relations** contact block (Gateway Group) | Layout becomes **two columns** (Headquarters + Depository Bank). |
| 9 | Temporarily hide **Email Alerts** (Overview CTA and related entry points) | Hide until the SGX mirror and subscription backend are production-ready; re-enable afterward. |

### Resources

| # | Request | Intent |
|---|---------|--------|
| 10 | Remove all **Gateway Group** content under Resources | Including the Gateway contact subsection on Contact Us (and any mirrored FAQ copy). |
| 11 | Hide **Email Alerts** under Resources | Same temporary hide as Overview; do not delete the feature permanently. |

### Content / assets (received from TDC)

| # | Request | Status |
|---|---------|--------|
| 12 | Update **Investment Presentation** in **two places** | **Complete** — updated in Overview and Events & Presentation. |

### SGX automation features requested by TDC

| # | Feature | Status |
|---|---------|--------|
| 13 | **Mirror SGX Company Announcements** | Scope identified — automatically retrieve new MetaOptics announcements from SGX and show them on the website. Requires a session-aware backend integration. |
| 14 | **Email Alerts** | Scope identified — store subscribers and email them when a new SGX announcement is detected. This is a newsletter/notification service, not the current Web3Forms submission. |

### Delivery status

- **Complete for this UI release:** presentation update, six-tab consolidation, canonical routes, Gateway/Overview cleanup, Email Alerts hiding and redirect configuration.
- **Deferred follow-ups:** SGX automatic synchronization and Email Alerts backend.

---

## 2. Scope — SGX Company Announcements mirror

### Source

- Filter page: `https://www.sgx.com/stock-exchange/company-announcements?value=METAOPTICS%20LTD&type=company`
- Session-dependent endpoint:

```text
GET https://api.sgx.com/announcements/v1.1/company
  ?value=METAOPTICS%20LTD
  &exactsearch=true
  &periodstart=...
  &periodend=...
  &pagestart=0
  &pagesize=20
```

This appears to be an internal SGX website endpoint rather than a documented public API. It requires a valid SGX web session and may change or block automated access. SGX usage/licensing permission must be confirmed before production.

### Proposed PHP backend

1. A scheduled PHP sync runs every **15 minutes** through server cron.
2. The script establishes/refreshes the required SGX session and calls the announcements endpoint.
3. It validates and normalizes the response, then stores announcements in MySQL.
4. SGX announcement reference/ID is used as a unique key to prevent duplicates.
5. Failed requests are retried with a safe limit and logged; existing cached data remains available during SGX downtime.
6. A read-only PHP JSON endpoint returns cached announcements to the frontend.
7. The website announcements section fetches this endpoint and retains its existing search, filters and pagination.
8. Each item links to the canonical SGX announcement/attachment for the MVP.

### MVP acceptance criteria

- A new MetaOptics announcement appears on the website within **30 minutes** of appearing on SGX.
- Repeated syncs never create duplicate announcements.
- SGX/API downtime does not remove existing website content.
- Date, title, category, issuer, reference and attachment/source links are displayed when available.
- Sync failures are logged and can be diagnosed.
- The frontend displays a graceful error/fallback if the backend is unavailable.

### Not included in the MVP

- Copying and hosting the full SGX article/attachments locally.
- A content management/admin interface.
- Historical backfill beyond an agreed initial period.
- Guaranteed compatibility if SGX changes or removes its internal endpoint.

---

## 3. Scope — Email Alerts

The existing Email Alerts form only sends a Web3Forms notification. It does **not** maintain a subscriber list or send announcement emails. It must be replaced with a real subscription backend.

### Proposed PHP backend

1. Add a PHP subscribe endpoint with server-side validation, rate limiting and bot protection.
2. Store subscriber email, optional name, status, consent timestamp and confirmation token in MySQL.
3. Send a **double opt-in** confirmation email; activate the subscription only after confirmation.
4. When the SGX sync inserts a new announcement, queue one notification per active subscriber.
5. Send a branded email containing the announcement title, date, summary/category and canonical SGX/website link.
6. Use a transactional email provider (for example Amazon SES, Postmark, SendGrid or Mailgun) rather than PHP `mail()`.
7. Track delivery state and retry temporary failures without sending duplicates.
8. Include a signed one-click unsubscribe link and immediately suppress unsubscribed addresses.
9. Keep SMTP/API credentials and SGX session data server-side.
10. Update the current frontend form and success/error/confirmation states to use the PHP API.

### MVP acceptance criteria

- A valid user can subscribe, confirm and unsubscribe.
- Invalid, duplicate and automated submissions are safely handled.
- Confirmed subscribers receive one email for each newly detected SGX announcement.
- Existing announcements do not trigger emails during initial import.
- A retry or repeated cron run never sends the same announcement twice to the same subscriber.
- Every email includes the company identity and unsubscribe link.
- Subscriber data is not exposed to the frontend or logs.

### Not included in the MVP

- Marketing campaigns unrelated to SGX announcements.
- Visual newsletter builder, audience segmentation or analytics dashboard.
- Daily/weekly digest mode unless requested.
- Importing an existing mailing list.

---

## 4. Backend assumptions and items to verify

The estimate below assumes:

- Production hosting supports **PHP 8.1+**, MySQL, HTTPS and cron jobs.
- TDC provides/approves an email sending provider and verified sender domain.
- The email provider account is approved and DNS records (SPF, DKIM and preferably DMARC) can be added.
- TDC approves double opt-in and provides Privacy Policy wording/contact details.
- SGX permits the intended use, or TDC accepts the maintenance risk of a session-dependent endpoint.
- Announcement MVP mirrors the **listing/metadata and links to SGX**, not the full article body.

Confirm with TDC/hosting:

1. Required sync frequency: **15 minutes recommended**, or another interval?
2. Mirror the list/metadata only, or reproduce full announcement details locally?
3. How much SGX history should be imported initially: **12 months recommended**?
4. Which email provider should be used, and which sender address/domain?
5. Double opt-in required? **Recommended: yes.**
6. Immediate email per announcement, or daily digest? **Recommended: immediate.**
7. Who receives operational alerts when SGX sync/email delivery fails?
8. Confirm PHP version, MySQL access and cron availability on production.

---

## 5. Revised estimate

| Work | Estimate |
|---|---:|
| Technical spike: SGX session/API reliability and response mapping | 0.5–1 day |
| PHP announcement sync, session refresh, normalization, database and deduplication | 2–3 days |
| Cron, cached JSON endpoint, logs, retries and frontend integration | 1.5–2 days |
| Subscriber API, database, double opt-in and unsubscribe | 2–2.5 days |
| Email provider integration, template, queue, retry and send deduplication | 1.5–2 days |
| End-to-end testing, deployment and production verification | 1–1.5 days |
| **Total for both backend features** | **8.5–12 working days** |

The estimate excludes waiting for SGX permission/access decisions, email-provider approval, DNS propagation and hosting credentials. A change to the SGX internal endpoint may require additional work.

Suggested delivery:

1. **Phase 2A — SGX mirror:** 4–6 working days.
2. **Phase 2B — Email Alerts:** 4–5 working days after Phase 2A.
3. **Contingency:** 0.5–1 day for deployment/session issues, included in the total range.

---

## 6. Confirmed alignment with TDC — IR UI

The transcript was ambiguous because it relied on screen-sharing, but all seven items below were subsequently confirmed using the recommended answers.

### Confirmed decisions

**1. Header dropdown**  
Confirm the dropdown to remove is the global header **INVESTOR RELATIONS** menu (Company Announcements / Analyst Coverage), so the nav item links straight to Overview.

- **Confirmed:** Yes — remove header IR dropdown; land on `/investor-relations`.

**2. Final tab structure — Governance vs Resources**  
TDC said “Governance and Resources.” Confirm whether that means:

- **(A)** Two separate tabs: Governance + Resources  
- **(B)** One combined tab

- **Confirmed:** **(A)** two tabs. Resources keeps Investor FAQs + Contact Us (no Email Alerts, no Gateway Group).

**3. News removal scope**  
Confirm whether to remove:

- **(A)** The entire News tab (Press Releases + Media)  
- **(B)** Press Releases only, and keep Media somewhere else

- **Confirmed:** **(A)** remove the entire News tab. Do not migrate the Media gallery.

**4. Financials → SGX Company Announcement**  
Confirm:

- Remove **SEC Filings** / Quarterly Results from public IR (replace Financials entirely)?  
- Keep the **“MetaOptics Ltd SGX Listing”** video on the announcements page?  
- Remove the homepage **News** block currently under the announcements page?

- **Confirmed:** Remove SEC/Quarterly from nav; keep listing video + announcements table; remove the extra News block under announcements.

**5. Which Analyst Coverage UI**  
Confirm which UI to keep as the IR tab:

- **(A)** Existing SGX page (`/analyst-coverage` — firms list, disclaimer, video)  
- **(B)** Nasdaq-style Firm / Analyst table under Stock Info (currently mock / hidden)

- **Confirmed:** **(A)** existing SGX page, wrapped in IR banner + tabs.

**6. Legacy URLs & presentation file**  
Confirm:

- Redirect `/company-announcement` and `/analyst-coverage` into the new IR tabs (301)?  
- Events & Presentation: replace **only** the Investor Presentation PDF, and keep the three whitepapers?

- **Confirmed:** Yes to both.

### Listing decision

**7. Dual listing vs SGX-first**  
FAQs still mention Nasdaq ticker **MOT** and ADR / JPMorgan. After replacing Financials with SGX announcements, is the IR site:

- **(A)** SGX-first / SGX-primary for this redesign  
- **(B)** Still dual listing (Nasdaq + SGX), with SEC content kept somewhere else

- **Confirmed:** **SGX only for now; Nasdaq is planned for a future phase.** Current IR copy must not present Nasdaq/MOT as a current listing.

---

## Recorded confirmation

```text
1Y 2A 3A 4Y/Y/Y 5A 6Y/Y
7) SGX only for now; Nasdaq planned for a future phase.
```

---

## Proposed implementation order

1. **Phase 1 — UI merge: complete.** Header, tabs, Overview cleanup, Gateway removal, Email Alerts hiding, nested IR routes and redirects are implemented.
2. **Phase 1b — Presentation PDF: complete.** Updated in Overview and Events & Presentation.
3. **Phase 2A — SGX announcements mirror: deferred, not implemented.** Build and deploy the PHP/MySQL sync service and replace the static frontend data source.
4. **Phase 2B — Email Alerts: deferred, not implemented.** Replace the retained hidden UI with subscriber management and automatic announcement notifications.

**Rough timeline to share with TDC (assuming §6 defaults):**

| Work | Estimate |
|------|----------|
| Phase 1 UI merge | Complete |
| Phase 1b PDF swap | Complete |
| Phase 2A SGX announcements mirror | ~4–6 working days |
| Phase 2B Email Alerts | ~4–5 working days after Phase 2A |
| Both backend features | ~8.5–12 working days total |

---

## Out of scope for this meeting (unless TDC expands)

- Re-enabling Stock Info / quote widgets  
- Changing Governance documents, board/management content, or FAQ answers unrelated to Gateway Group  
- Broader Nasdaq/dual-listing content beyond the confirmed future-phase statement
- Newsletter campaigns unrelated to SGX announcements, admin dashboards and advanced subscriber analytics
