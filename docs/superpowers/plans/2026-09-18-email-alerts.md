# Email Alerts Implementation Plan (CodeIgniter 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let investors subscribe to IR announcement categories (single opt-in), receive confirmation email, one-click unsubscribe, and get at most one campaign email per published announcement when admin clicks Send — via a mailer interface and a Spark delivery worker.

**Architecture:** Extends CI4 `backend/` after Mirror + CMS. Public API controllers for subscribe/unsubscribe; migrations for `subscribers`, `subscriber_categories`, `email_deliveries`. `MailerInterface` with `LogMailer` default and `SmtpMailer`. CMS Send already creates `email_campaigns`; `CampaignFanout` inserts deliveries; `php spark email:work` claims batches of ~100. Frontend Email Alerts page behind `showEmailAlerts`.

**Tech Stack:** CodeIgniter 4.7+, MySQL, CI Validation + Throttler, Spark command, PHPUnit, Next.js form.

## Global Constraints

- Depends on Mirror announcements + CMS `email_campaigns` and Publish-before-Send.
- All new code in CI4 `app/` (Controllers/Models/Libraries/Commands/Views).
- Single opt-in: `active` immediately; queue/send confirmation.
- One campaign per announcement; retry only `failed_temp` deliveries.
- Provider unset: `MAIL_DRIVER=log` until SMTP/provider chosen; domain logic never imports a vendor SDK directly — only `MailerInterface`.
- Subscribe: rate-limit + honeypot; always `{ "ok": true }` (no enumeration).
- Unsubscribe token deterministic per subscriber id (HMAC); URL has no plaintext email.
- After unsubscribe keep suppression email; scrub names after 30 days via Spark command.
- Categories: bootstrap strings from `ANNOUNCEMENT_CATEGORIES` until TDC list.
- CORS same allowlist as announcements API.
- Design: `docs/SGX_MIRROR_EMAIL_ALERTS_CMS_DESIGN_VI.md`.
- MVP ~5,000 subscribers; Send HTTP returns after queue/fanout only.

---

## File Structure

```text
backend/
  app/Database/Migrations/2026-09-18-120000_CreateEmailAlertTables.php
  app/Models/SubscriberModel.php
  app/Models/SubscriberCategoryModel.php
  app/Models/EmailDeliveryModel.php
  app/Libraries/Email/MailerInterface.php
  app/Libraries/Email/MailMessage.php
  app/Libraries/Email/LogMailer.php
  app/Libraries/Email/SmtpMailer.php
  app/Libraries/Email/EmailNormalizer.php
  app/Libraries/Email/CategoryCatalog.php
  app/Libraries/Email/UnsubscribeToken.php
  app/Libraries/Email/SubscribeService.php
  app/Libraries/Email/UnsubscribeService.php
  app/Libraries/Email/CampaignFanout.php
  app/Libraries/Email/DeliveryWorker.php
  app/Controllers/Api/Subscribers.php
  app/Controllers/Api/Unsubscribe.php
  app/Commands/EmailWork.php
  app/Commands/ScrubUnsubscribedPii.php
  app/Views/emails/confirmation.php          # text/plain views
  app/Views/emails/announcement.php
  app/Views/emails/admin_digest.php
  app/Config/Services.php                    # mailer()
  app/Config/EmailAlerts.php
  tests/unit/Email/*.php
  tests/feature/Api/SubscribeApiTest.php
src/lib/subscribe-api.js
src/lib/subscribe-api.test.mjs
src/layouts/investor-relations/email-alerts-form.js
src/app/investor-relations/resources/email-alerts/page.js
src/constants/ir-feature-flags.js
```

---

### Task 1: Email migrations

**Files:**
- Create: `2026-09-18-120000_CreateEmailAlertTables.php`
- Create: three Models
- Test: `backend/tests/database/EmailMigrationTest.php`

**Interfaces:**
- `subscribers`: email UNIQUE, names nullable, status `active|unsubscribed`, `consented_at`, `unsubscribed_at`, `unsubscribe_token_hash` UNIQUE CHAR(64)
- `subscriber_categories`: PK (`subscriber_id`, `category_key`)
- `email_deliveries`: UNIQUE (`campaign_id`, `subscriber_id`), status `queued|sending|sent|failed_temp|failed_perm`, `attempts`, `provider_message_id`, `last_error`

- [ ] **Step 1: Failing tableExists test**

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Forge migration** (CI4 style, FKs to `announcements` via campaigns already exists)

- [ ] **Step 4: `php spark migrate` + PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(email): subscribers, categories, and deliveries migrations"
```

---

### Task 2: Normalizer, CategoryCatalog, UnsubscribeToken

**Files:**
- Create: `EmailNormalizer`, `CategoryCatalog`, `UnsubscribeToken`
- Create: `Config\EmailAlerts` with `unsubscribeSecret` from `email.unsubscribeSecret`
- Test: unit tests

**Interfaces:**
- `EmailNormalizer::normalize(string $email): string` — trim + lower; throw if invalid
- `CategoryCatalog::all(): list<string>` — eight keys matching frontend
- `CategoryCatalog::assertValid(array $keys): void`
- `UnsubscribeToken::forSubscriber(int $id): string` — `hash_hmac('sha256', 'unsub:'.$id, $secret)`
- `UnsubscribeToken::hashPlain(string $plain): string` — `hash('sha256', $plain)`
- `UnsubscribeToken::matches(string $plain, string $storedHash): bool`

- [ ] **Step 1: Tests**

```php
public function test_token_is_deterministic_per_subscriber(): void
{
    $tok = new UnsubscribeToken('unit-test-secret-min-32-chars-long!!');
    $plain = $tok->forSubscriber(42);
    $this->assertSame($plain, $tok->forSubscriber(42));
    $this->assertTrue($tok->matches($plain, $tok->hashPlain($plain)));
}
```

- [ ] **Step 2–5: Implement, PASS, commit**

```bash
git commit -m "feat(email): normalizer, categories, and unsubscribe tokens"
```

---

### Task 3: MailerInterface + LogMailer + SmtpMailer + views

**Files:**
- Create mailer classes + email views
- Modify: `Config\Services::mailer()`
- `.env`: `MAIL_DRIVER=log`, SMTP_* , `mail.from`
- Test: `LogMailerTest`

**Interfaces:**

```php
final class MailMessage {
    public function __construct(
        public string $to,
        public string $subject,
        public string $textBody,
        public ?string $htmlBody = null,
    ) {}
}

interface MailerInterface {
    public function send(MailMessage $message): string; // provider id
}
```

`LogMailer` appends JSON lines to `WRITEPATH . 'logs/mail.log'`.
`SmtpMailer` uses CI `Email` class or raw SMTP from env; throw if host empty when driver=smtp.

```php
public static function mailer($getShared = true): MailerInterface
{
    $driver = env('MAIL_DRIVER', 'log');
    if ($driver === 'smtp') {
        return new SmtpMailer(config('Email'));
    }
    return new LogMailer(WRITEPATH . 'logs/mail.log');
}
```

- [ ] **Step 1–5: TDD LogMailer + commit**

```bash
git commit -m "feat(email): mailer interface with log driver and templates"
```

---

### Task 4: SubscribeService + API controller

**Files:**
- Create: `SubscribeService`, `Api\Subscribers`
- Modify: Routes — `POST /api/subscribers`
- Use CI `Throttler` for rate limit (10/hour/IP)
- Test: unit + feature

**Interfaces:**
- JSON body: `email`, `first_name?`, `last_name?`, `categories: string[]`, `website` honeypot (must be `""`)
- Always `200 { "ok": true }`
- Honeypot filled → no-op success
- New → insert active + categories + token hash from `forSubscriber($id)` (update hash after insert) + send confirmation via mailer
- Existing active → replace categories
- Existing unsubscribed → reactivate, new consent, refresh token hash, confirmation again

```php
$routes->post('api/subscribers', 'Api\Subscribers::create');
```

- [ ] **Step 1: Tests** — creates active; honeypot noop

- [ ] **Step 2–5: Implement + commit**

```bash
git commit -m "feat(email): subscribe API with honeypot and confirmation"
```

---

### Task 5: UnsubscribeService + API

**Files:**
- Create: `UnsubscribeService`, `Api\Unsubscribe`
- Route: `POST /api/unsubscribe` body `{ "token": "..." }`
- Test: unit

**Interfaces:**
- Lookup `unsubscribe_token_hash = hashPlain(token)`; set unsubscribed; always `{ "ok": true }`

- [ ] **Step 1–5: TDD + commit**

```bash
git commit -m "feat(email): signed unsubscribe API"
```

---

### Task 6: CampaignFanout wired to SendEmailGate

**Files:**
- Create: `CampaignFanout`
- Modify: `SendEmailGate::queueCampaign` to call fanout after insert
- Modify: `Campaigns::retryFailed` to re-queue `failed_temp` only
- Test: `CampaignFanoutTest`

**Interfaces:**
- Match `announcement.category` exactly to `subscriber_categories.category_key`
- Only `status=active`
- `INSERT IGNORE` / catch duplicate on UNIQUE
- Set `email_campaigns.recipient_count`

- [ ] **Step 1: Test** — A matches, B wrong category, C unsubscribed → only A

- [ ] **Step 2–5: Implement + commit**

```bash
git commit -m "feat(email): fan out campaign deliveries to matching subscribers"
```

---

### Task 7: DeliveryWorker + `email:work` Spark command

**Files:**
- Create: `DeliveryWorker`, `Commands\EmailWork`
- Test: `DeliveryWorkerTest`

**Interfaces:**
- `DeliveryWorker::processBatch(int $limit = 100): int`
- Claim queued rows → `sending`, increment attempts (transaction + row lock where supported)
- Skip if subscriber not active → `failed_perm` / `unsubscribed`
- Unsub URL: `{publicSite}/investor-relations/resources/email-alerts?unsub=` + `UnsubscribeToken::forSubscriber($id)`
- Temp failure → `failed_temp` if attempts < 3 else `failed_perm`
- Success → `sent` + provider id
- Close campaign: all terminal → `sent` or `partial_failed`
- Cron: `* * * * * cd /path/backend && php spark email:work`

```php
class EmailWork extends BaseCommand
{
    protected $name = 'email:work';
    public function run(array $params): int
    {
        $n = (new DeliveryWorker(db_connect(), Services::mailer(), new UnsubscribeToken(config('EmailAlerts')->unsubscribeSecret)))
            ->processBatch(100);
        CLI::write("sent_or_processed={$n}");
        return EXIT_SUCCESS;
    }
}
```

- [ ] **Step 1: Tests** — unsub mid-queue; retry cap; no duplicate sent

- [ ] **Step 2–5: Implement + commit**

```bash
git commit -m "feat(email): delivery worker spark command with retry"
```

---

### Task 8: Admin digest mailer + PII scrub command

**Files:**
- Modify: `AdminDigestNotifier` to `Services::mailer()` + `emails/admin_digest` view
- Create: `Commands\ScrubUnsubscribedPii` — `php spark email:scrub-pii`
- Test: notifier unit test with LogMailer

```php
// scrub: SET first_name=NULL, last_name=NULL WHERE status=unsubscribed AND unsubscribed_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
```

- [ ] Commit

```bash
git commit -m "feat(email): admin digest mailer and 30-day PII scrub command"
```

---

### Task 9: Frontend form + flag

**Files:**
- `src/lib/subscribe-api.js` + test
- `src/layouts/investor-relations/email-alerts-form.js`
- Modify email-alerts page for form + `?unsub=` token POST
- Keep `showEmailAlerts: false` until staging OK; update `scripts/check-ir-ui.mjs` in same PR as flag flip

- [ ] **Step 1: Node test** `buildSubscribePayload` includes empty honeypot

- [ ] **Step 2–5: Implement, leave flag false, commit**

```bash
git commit -m "feat(ir): email alerts form behind feature flag"
```

---

### Task 10: Smoke seed + staging checklist

**Files:**
- `php spark email:seed-smoke` (optional Command) — 5000 subscribers staging only when `CI_ENVIRONMENT=staging`
- `docs/superpowers/plans/checklists/2026-09-18-email-alerts-staging.md`

Checklist: subscribe + confirmation log; honeypot; publish+send fanout; one campaign; unsub blocks worker; retry temp only; 5k smoke Send &lt; 2s; flip FE flag on staging.

```bash
git commit -m "docs: email alerts staging checklist and smoke seed"
```

---

## Self-Review

1. **Spec coverage:** subscribe/confirm/unsub, adapter, queue/worker/retry/dedupe, publish-before-send, digest, PII scrub, FE form — covered.
2. **Placeholders:** Provider = Log + SMTP config; extra providers implement `MailerInterface` only.
3. **Consistency:** deterministic unsub token; UNIQUE campaign/delivery constraints; category strings match FE.

---

**Plan complete and saved to `docs/superpowers/plans/2026-09-18-email-alerts.md`. Two execution options:**

**1. Subagent-Driven (recommended)**  
**2. Inline Execution**  

Execute after CMS Publish/Send exists on staging.
