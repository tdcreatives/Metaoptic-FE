# Email Alerts staging checklist (CI4)

Manual checks on a production-like **staging** host after Mirror + CMS checklists are green. Public API: `POST /api/subscribers`, `POST /api/unsubscribe`. Admin Send: `POST /admin/announcements/{id}/send`. Worker: `php spark email:work` from `backend/`.

**Do not** run this against production SMTP. Keep `MAIL_DRIVER=log` (writes `writable/logs/mail.log`) unless staging has a dedicated sandbox mailbox. Confirmation and announcement mail must not leave the sandbox.

**Do not** flip `showEmailAlerts` in git until this checklist is green. The last section is the only place that flag changes, and it is a staging/deploy step (same PR as `.htaccess` + `scripts/check-ir-ui.mjs`).

## Subscribe + confirmation log

- [ ] `POST /api/subscribers` JSON `{ email, first_name, last_name, categories: ["General Announcement"], website: "" }` returns `{ "ok": true }` (HTTP 200).
- [ ] `subscribers` row is `status=active` immediately (single opt-in); `consented_at` set; `unsubscribe_token_hash` unique.
- [ ] `subscriber_categories` has `General Announcement` for that id.
- [ ] Confirmation is queued/sent via `MailerInterface` (Log: one JSON line in `writable/logs/mail.log` with that `to` and subject `Confirm your MetaOptics IR alerts subscription`).
- [ ] Body contains an unsubscribe URL with the HMAC token and **no plaintext email**.
- [ ] Repeat subscribe with the same email still returns `{ "ok": true }` and does not create a second `subscribers` row.
- [ ] Invalid email / invalid category still returns `{ "ok": true }` and inserts nothing.

## Honeypot

- [ ] Same POST with `website` set to any non-empty string returns `{ "ok": true }`.
- [ ] No new `subscribers` row; no mail.log line.
- [ ] Rate-limit: 11th subscribe from the same IP within an hour still returns `{ "ok": true }` and does not enumerate.

## Publish + send fanout

- [ ] Send on a **non-published** announcement flashes `not_published` and creates no `email_campaigns` / `email_deliveries`.
- [ ] Publish first (`POST /admin/announcements/{id}/publish`) so `state=published`.
- [ ] Send (`POST /admin/announcements/{id}/send`) creates one `email_campaigns` row (`status=queued`, UNIQUE `announcement_id`) and audits `send`.
- [ ] HTTP response returns after queue/fanout only (page flash `Email queued`) — worker is a separate `php spark email:work`.
- [ ] `CampaignFanout` inserts `email_deliveries` (`status=queued`) for **active** subscribers whose `subscriber_categories` match the announcement category.
- [ ] Inactive / unsubscribed / non-matching categories get no delivery row.

## One campaign

- [ ] Second Send on the same announcement flashes `campaign_exists`.
- [ ] Still exactly one `email_campaigns` row (`announcement_id` unique).
- [ ] Duplicate fanout does not create duplicate deliveries (`UNIQUE (campaign_id, subscriber_id)`).

## Unsub blocks worker

- [ ] Queue a campaign so a delivery sits `queued`.
- [ ] `POST /api/unsubscribe` with that subscriber’s token returns `{ "ok": true }`; row becomes `status=unsubscribed`, `unsubscribed_at` set; **email kept** (suppression).
- [ ] `php spark email:work` claims the queued row but does **not** send; delivery ends `failed_perm` (`last_error` unsubscribed).
- [ ] Later Send/fanout for that category skips the unsubscribed row.

## Retry temp only

- [ ] A `failed_temp` delivery (worker exception, attempts &lt; 3) is re-queued by `POST /admin/campaigns/{id}/retry-failed` (`status` back to `queued`; audit `retry`).
- [ ] `failed_perm` and `sent` rows are not re-queued.
- [ ] Worker retries temp failures until attempts cap (3) then `failed_perm`.
- [ ] If `email_deliveries` is missing, retry flashes `Email worker not deployed`.

## 5k smoke — Send &lt; 2s

Use **Log** mailer (or sandbox SMTP). Never production SMTP.

- [ ] Staging `.env` has `CI_ENVIRONMENT=staging` (command refuses any other value).
- [ ] `php spark email:seed-smoke` inserts ~5000 active subscribers (`smoke-NNNNN@example.test`, category `General Announcement`). Re-run is a no-op for existing smoke emails.
- [ ] Publish a **test** announcement in `General Announcement` (or use an existing published one with no campaign).
- [ ] Time the Send HTTP: fanout/queue returns in **&lt; 2 seconds**. Send does not wait for `email:work`.
- [ ] `email_campaigns.recipient_count` ≈ 5000; deliveries are `queued` (not sent yet).
- [ ] `php spark email:work` in a loop drains batches of ~100 without duplicate `sent` rows (`UNIQUE campaign_id+subscriber_id`).
- [ ] Delete or leave smoke rows on staging only; do not copy them to production.

## Flip FE flag on staging

Only after the boxes above are green. This is **not** part of the Email Alerts implementation commit; keep `showEmailAlerts: false` in git until that PR.

- [ ] Staging Next `.env` has `NEXT_PUBLIC_IR_API_BASE` pointing at the CI4 `public/` origin.
- [ ] Flip `IR_LAUNCH_FLAGS.showEmailAlerts` to `true`, update `.htaccess` IR redirect, and relax `scripts/check-ir-ui.mjs` **in the same PR**.
- [ ] `/investor-relations/resources/email-alerts` renders the form (honeypot field present, empty).
- [ ] Form subscribe hits `/api/subscribers`; confirmation still log/sandbox only.
- [ ] `?unsub=` on that page POSTs `/api/unsubscribe` and blocks later worker sends.
- [ ] Flag-off (rollback): page redirects; public subscribe API can stay up for ops tests.
