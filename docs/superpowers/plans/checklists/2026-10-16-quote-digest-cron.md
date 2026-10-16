# Daily 9MT quote digest — cron & staging checklist (CI4)

Manual checks on a production-like **staging** host after Email Alerts baseline is green. CLI: `php spark quote:digest` from `backend/`. Admin history: `/admin/quote-digest-runs`. Audience: active subscribers with `subscriber_categories.category_key = Press Release` (exact string).

**Do not** point production SMTP at real subscribers until this checklist is green. Prefer `MAIL_DRIVER=log` (`writable/logs/mail.log`) or a dedicated sandbox mailbox for dry-runs.

**Follow-up (v1 gap):** SG public holidays are **not** skipped — only Sat/Sun (`TradingDayGate`). See design §6 in [`2026-10-16-daily-mot-quote-digest.md`](../../designs/2026-10-16-daily-mot-quote-digest.md).

## Database & deploy

- [ ] Run `cd backend && php spark migrate` — table `quote_digest_runs` exists with unique `digest_date`.
- [ ] `php spark list` includes `quote:digest`.
- [ ] At least one **admin digest recipient** is active (same list as SGX new-item alerts) so ops failure mail has a target.

## FE category (Press Release)

- [ ] `ANNOUNCEMENT_CATEGORIES` in `src/utils/announcements.js` includes **`Press Release`** (feeds `email-alerts-form.js` when `showEmailAlerts` is on).
- [ ] IR Email Alerts subscribe UI shows Press Release; submitted payload sends category **`Press Release`** to `POST /api/subscribers` (not a slug alias).

## Subscribe test mailbox

- [ ] `POST /api/subscribers` with `{ email, first_name, last_name, categories: ["Press Release"], website: "" }` returns `{ "ok": true }`.
- [ ] `subscribers` row is `status=active`; `subscriber_categories` has `Press Release` for that id.

## Host cron (Asia/Singapore, Mon–Fri)

Host timezone must be **Asia/Singapore**, **or** prefix each line with `TZ=Asia/Singapore` (same pattern as SGX sync in `backend/README.md`). Replace `/path/to/backend` with the deployed backend directory (e.g. `/var/www/metaoptics-ir/backend`).

```cron
0 16 * * 1-5 cd /path/to/backend && php spark quote:digest >> writable/logs/quote-digest.log 2>&1
5 16 * * 1-5 cd /path/to/backend && php spark quote:digest >> writable/logs/quote-digest.log 2>&1
15 16 * * 1-5 cd /path/to/backend && php spark quote:digest >> writable/logs/quote-digest.log 2>&1
```

- [ ] Three entries installed; log file path is writable (`writable/logs/quote-digest.log`).
- [ ] Cron user can run `php spark quote:digest` and reach SGX HTTPS from the host.

## Dry-run weekday (LogMailer)

Use a **weekday** in SGT. Set `MAIL_DRIVER=log` in backend `.env`.

- [ ] Manual: `cd backend && php spark quote:digest` — CLI prints `success` (or `skipped_no_recipients` if no Press Release subs).
- [ ] One `quote_digest_runs` row for today: `status=success`, snapshot fields populated, `recipient_count` matches active Press Release subs.
- [ ] `writable/logs/mail.log` has one JSON line per recipient; subject is daily 9MT quote copy; body has no chart; CTA to SGX 9MT; volume shown as shares (×1000 from API `vl`).
- [ ] Second run same calendar day: idempotent — no duplicate subscriber mail; CLI indicates already completed.

## Weekend skip

- [ ] On **Saturday or Sunday** (SGT), `php spark quote:digest` returns `skipped_non_trading_day`.
- [ ] Run row: `status=skipped_non_trading_day`, `attempt_count=0`; no mail.log digest lines.

## Third failure → ops alert

Simulate fetch/send failure (e.g. block SGX URL on staging, or inject a failing mailer in a one-off test — not in git).

- [ ] First two weekday attempts leave run `failed` with `attempt_count` 1 then 2; subscribers not sent on those attempts.
- [ ] Third cron slot (16:15) increments to attempt 3; after final failure, **no** subscriber digest is sent.
- [ ] Admin digest recipients receive email subject `Daily 9MT digest failed — YYYY-MM-DD`; body includes failure reason and link to `/admin/quote-digest-runs/{id}`.
- [ ] Fourth manual/cron invoke same day: `Max attempts reached`; no extra ops spam (notifier only on terminal failure path per implementation).

## CMS smoke

- [ ] Admin → **Daily stock digest** lists today’s run; detail shows last price, change, volume, delivery counts.
