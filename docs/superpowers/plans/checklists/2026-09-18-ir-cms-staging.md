# IR CMS staging checklist (CI4)

Manual checks on a production-like staging host after SGX Mirror is green. Admin: `/admin/*`. Public API: `GET /api/announcements`. Email Alerts are a separate CMS entity; Publish and investor email are independent workflows.

## Login rate limit

- [ ] `POST /admin/login` with a wrong password five times from the same IP.
- [ ] Sixth attempt within 15 minutes returns `Too many attempts` and does not set an admin session.
- [ ] Wait 15 minutes (or clear `admin_login_<ip>` cache) and a correct login succeeds.
- [ ] Successful login regenerates the session and writes `audit_log.action = login` with no password/hash in metadata.

## Cookie flags

- [ ] Set `cookie.secure=true` in backend `.env` on HTTPS staging (does **not** require `CI_ENVIRONMENT=production`).
- [ ] Session cookie is HttpOnly, Secure, SameSite=Strict (`Config\Cookie`).
- [ ] Admin POSTs without CSRF token are rejected.

## Summary edit keeps source

- [ ] Open a pending announcement; note `source_payload` JSON and SGX source title.
- [ ] POST summary / FE layout fields via the detail update with extra forbidden fields (`source_payload`, `state`, `title`).
- [ ] FE fields and summary save; `source_payload` and SGX source title remain immutable; `state` unchanged.
- [ ] Email subject/intro are **not** on announcement detail — compose lives on Email Alert.
- [ ] `audit_log` has `summary_edit` for that announcement id.

## Publish → public API

- [ ] Publish a pending item (`POST /admin/announcements/:id/publish`).
- [ ] Row is `state=published`, `published_at` set, `needs_review=0`.
- [ ] `GET /api/announcements` includes that slug; pending/archived rows stay absent.
- [ ] Source payload / `needs_review` never appear on the public API.

## Publish may offer Email Alert draft

- [ ] After a successful Publish, CMS **may** offer a prefilled Email Alert **draft** (optional).
- [ ] Declining the offer, or draft creation failure, does **not** un-publish the announcement.
- [ ] Published state and public API row remain regardless of draft outcome.

## Announcement detail has no Send

- [ ] Announcement detail has **no Send** button or send action.
- [ ] No investor-email send endpoint on announcement detail (`/admin/announcements/:id`).

## Create Email Alert with this (Published only)

- [ ] On a non-Published item, **Create Email Alert with this** is absent or disabled.
- [ ] On a Published item, the shortcut opens a new Email Alert with this announcement attached.

## Email Alerts compose

- [ ] **Email Alerts** list / compose / detail is separate from announcement detail.
- [ ] Attach **1…N Published** announcements; non-Published items cannot be attached.
- [ ] Compose subject, intro, and WYSIWYG body on the Email Alert (not on announcement detail).
- [ ] **Schedule** (Singapore time) or **Send now** queues/sends the alert.
- [ ] Delivery report shows queued / sent / failed for that alert.

## One announcement, many alerts

- [ ] The same Published announcement can be attached to **many** Email Alerts over time.
- [ ] No unique-one-alert constraint per announcement.

## Recipients audited

- [ ] Add a valid digest recipient; `admin_recipients` row is active; audit `settings_recipients` with `action: add`.
- [ ] Invalid email is rejected; no row and no audit.
- [ ] Deactivate; `active=0`; audit `settings_recipients` with `action: deactivate`.
- [ ] Re-adding an inactive email reactivates it (no duplicate unique-email error).

## Sync runs visible

- [ ] `GET /admin/sync-runs` lists `sync_runs` newest first (status, counts, error).
- [ ] After an incremental sync with new items, a new run is visible and `admin_digest` is logged (or mailed if mailer exists).
- [ ] Archive (`POST /admin/announcements/:id/archive`) sets `state=archived`, audits `archive`, and drops the item from `GET /api/announcements`.
