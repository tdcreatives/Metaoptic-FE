# IR CMS staging checklist (CI4)

Manual checks on a production-like staging host after SGX Mirror is green. Admin: `/admin/*`. Public API: `GET /api/announcements`. Digest mailer is still `log_message` until the Email plan.

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

- [ ] Open a pending announcement; note `source_payload` JSON.
- [ ] POST summary / email subject / intro with extra fields (`source_payload`, `state`, `title`).
- [ ] Only `summary`, `email_subject`, `email_intro` change; source JSON, title, and state are unchanged.
- [ ] `audit_log` has `summary_edit` for that announcement id.

## Publish → public API

- [ ] Publish a pending item (`POST /admin/announcements/:id/publish`).
- [ ] Row is `state=published`, `published_at` set, `needs_review=0`.
- [ ] `GET /api/announcements` includes that slug; pending/archived rows stay absent.
- [ ] Source payload / `needs_review` never appear on the public API.

## Send gate

- [ ] Send on a non-published item flashes `not_published` and creates no `email_campaigns` row.
- [ ] Send button is disabled until `state === published`.
- [ ] After publish, Send queues one campaign (`status=queued`) and audits `send`.

## One campaign

- [ ] Second Send on the same announcement flashes `campaign_exists`.
- [ ] `email_campaigns.announcement_id` remains unique (still one row).

## Recipients audited

- [ ] Add a valid digest recipient; `admin_recipients` row is active; audit `settings_recipients` with `action: add`.
- [ ] Invalid email is rejected; no row and no audit.
- [ ] Deactivate; `active=0`; audit `settings_recipients` with `action: deactivate`.
- [ ] Re-adding an inactive email reactivates it (no duplicate unique-email error).

## Sync runs visible

- [ ] `GET /admin/sync-runs` lists `sync_runs` newest first (status, counts, error).
- [ ] After an incremental sync with new items, a new run is visible and `admin_digest` is logged (or mailed if mailer exists).
- [ ] Archive (`POST /admin/announcements/:id/archive`) sets `state=archived`, audits `archive`, and drops the item from `GET /api/announcements`.
