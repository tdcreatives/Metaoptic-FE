# Announcements CRUD + Email Alerts (decoupled)

**Date:** 2026-09-28  
**Status:** Design accepted (brainstorming)  
**Branch context:** `feat/sgx-mirror-ci4` (CI4 admin under `/admin`)  
**UI/UX:** Reviewed in brainstorming (§1–§3); MetaOptics admin chrome / existing `admin.css` tokens

## Understanding summary

- Split CMS into (1) full **Announcements CRUD** and (2) independent **Email Alerts** that can attach **0…N Published** announcements (product rule: send/schedule requires **≥1** attach).
- SGX sync continues to upsert into the announcements list; manual Create is also allowed.
- Email Alert supports one-shot **schedule (SGT)** + **Send now**, per-alert **report** (queued/sent/failed + open/click UI as n/a until ESP), and a **small dashboard** per alert.
- Audience remains category-based: **union of categories** of attached announcements; no attach → no schedule/send.
- Replaces the old **1 announcement → 1 Send** CMS flow (hide/remove Send on announcement detail).

## Assumptions

| Area | Assumption |
|------|------------|
| Scale | ~5 admins, ~10k subscribers, ~20 announcements/month, tens of alerts/month |
| Performance | Compose/schedule synchronous; fanout async via existing `email:work` |
| Reliability | Scheduled sends via cron/worker; retry `failed_temp` as today |
| Security | Existing admin auth; public subscribe model unchanged |
| Open/click | UI shows “—” / n/a until ESP provides tracking |
| Editor | **WYSIWYG** (not Markdown) for alert body |
| Timezone | All schedule UI and storage semantics in **Asia/Singapore** |
| FE flags | Do **not** flip `useAnnouncementsApi` / `showEmailAlerts` in this design |

## Explicit non-goals (MVP)

- Recurring digests / weekly investor digests
- Auto-send email on SGX sync
- Attaching Pending/Archived announcements
- Editing or deleting a **Sent** alert’s content (snapshot immutable)
- Deleting an alert while **Sending** (or Active/on-sending)
- Full ESP integration / open-click instrumentation in MVP
- Changing public IR page UX beyond consuming published announcements as today

## Decision log

| Decision | Alternatives | Why |
|----------|--------------|-----|
| Approach **1**: Announcements CRUD + Email Alert entity | Stretch `email_campaigns`; hybrid Alert UI → campaign | Matches independent alert model; clear schedule/report |
| Email ↔ Announcement **0…N** (send requires ≥1) | Keep 1:1; always-all-subscribers | Bundle/digest-style alerts without breaking category subscribe |
| Attach **Published only** | Pending allowed | Keeps Publish-to-website separate from email |
| Audience = **union categories** of attaches | Admin picks categories; send all | Reuses existing subscriber preferences |
| Schedule **one-shot** + **Send now** | Recurring; send-now only | Enough for IR ops |
| Report: counts + open/click **n/a** | Counts only; block on ESP | UI ready without blocking on provider |
| Compose: subject + intro + **WYSIWYG** + `{{announcement}}` | Markdown; fixed list-only | Rich body + merge token |
| Alert **Delete**: allowed in **Draft**; blocked while **Sending**; Sent keeps snapshot | Block delete whenever attached | Draft = not done |
| Deprecate announcement-detail **Send** | Keep both entry points | Avoid dual mental models |
| Announcement email subject/intro fields | Keep dual compose | Prefer compose only on Email Alert (summary stays for website) |

## Final design

### IA & navigation

1. Dashboard — announcement + alert status counts  
2. **Announcements** — CRUD  
3. **Email Alerts** — list / compose / detail dashboard *(new)*  
4. Sync history  
5. Settings (digest recipients)

```text
SGX sync ──► upsert Announcements (pending | backfill published)
Admin CRUD ──► Create manual / Edit / Publish / Archive / Delete*
Publish ──► eligible to attach on Email Alert

Email Alert (Draft)
  ├─ ≥1 Published + WYSIWYG + {{announcement}}
  ├─ Schedule (SGT) → Scheduled → worker → Sending → Sent
  ├─ Send now → Sending → Sent
  └─ Delete only in Draft
```

### Announcements module

- **List:** filter status/category/search; columns include source **SGX | Manual**, `needs_review`  
- **Create/Edit manual:** title, category, filed_at (SGT), source URL optional, summary; optional body  
- **SGX rows:** source fields read-only; edit summary (website); deprecate per-item email subject/intro  
- **Detail actions:** Publish · Archive · Delete (409 if locked by Sending alert) · “Create Email Alert with this” when Published  
- **Remove/hide** Send Email on announcement detail  

### Email Alerts module

- **Statuses:** `draft` · `scheduled` · `sending` · `sent` (+ cancel → back to draft)  
- **Compose:** name (optional), subject, intro, WYSIWYG body with insertable `{{announcement}}` chip; if token missing, announcement list appended at end on send  
- **Attach:** Published only; chips; preview title/date/link  
- **Audience readout:** categories union + estimated subscriber count (read-only)  
- **Sendout:** schedule datetime SGT **or** Send now (confirm modal)  
- **Detail dashboard:** metrics queued/sent/failed/open/click; attached list (snapshot when Sent); deliveries table; Edit/Delete only Draft; Scheduled → Edit/Cancel; Sending view-only; Sent view-only + retry `failed_temp`  

### Data (logical)

- `announcements.source` = `sgx` | `manual`; `sgx_reference` nullable for manual  
- `email_alerts` — compose fields, status, `scheduled_at`, `sent_at`, category audience snapshot  
- `email_alert_announcements` — order + **snapshot** fields copied at Sending/Sent  
- Reuse `email_campaigns` + `email_deliveries`: one alert → one campaign when entering Sending  
- Workers: due-schedule picker + existing `email:work`  

### Errors & edges

- No attaches / empty category union → cannot schedule/send  
- Delete alert while Sending → 409  
- Delete announcement while referenced by Sending alert → 409  
- Audience categories **frozen at Sending**  
- Multiple `{{announcement}}` → same rendered list each time  
- ESP outage → `failed_temp`; open/click remain n/a  

### UI/UX guidelines (admin)

- Equal nav weight for Announcements vs Email Alerts  
- One primary action per screen; destructive Delete grouped apart  
- Status chips consistent; Sending may use subtle in-progress affordance  
- Token as editor chip, not raw syntax only  
- Dashboard: four metrics above, deliveries table below  
- Continue existing MetaOptics admin tokens (`admin.css`); no generic purple/dashboard clutter  

### Testing (MVP)

- Unit: token render, category union, delete guards, schedule due  
- Feature: manual CRUD; alert schedule → worker → deliveries; Send now; public API published-only  
- Smoke: filters, Send now confirm, dashboard metrics  

## Migration note vs prior scope

Client scope previously required **Publish-before-Send** on a **per-announcement** Send button and **one campaign per announcement**. This design keeps Publish-before-**attach**, but moves Send to **Email Alert** and allows **many announcements per alert**. Stakeholder/client scope doc should be updated when implementing.
