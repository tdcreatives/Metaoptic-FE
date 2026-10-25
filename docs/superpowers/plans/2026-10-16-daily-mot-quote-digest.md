# Daily MOT (9MT) Quote Digest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send a fully automatic daily MetaOptics (SGX: 9MT) stock-quote email at 16:00 Asia/Singapore on weekdays to active subscribers who opted into category `Press Release`, with CMS run history and ops alerts on final failure.

**Architecture:** Separate `QuoteDigestService` job (CLI `quote:digest`), not Email Alert campaigns. Fetch unofficial SGX securities JSON → validate → render HTML via existing `emails/_layout.php` → send per subscriber with `Services::mailer()` + unsubscribe links → persist `quote_digest_runs`. Cron invokes the same command at 16:00 / 16:05 / 16:15; day-key idempotency + attempt_count caps retries at 3.

**Tech Stack:** CodeIgniter 4 (PHP 8.x), MySQL/SQLite via CI4 forge, existing `MailerInterface` / `UnsubscribeToken`, Next.js FE `ANNOUNCEMENT_CATEGORIES`, PHPUnit.

**Spec:** `docs/superpowers/designs/2026-10-16-daily-mot-quote-digest.md`

## Global Constraints

- Category string exact: `Press Release` (same in CMS catalog, FE subscribe form, `subscriber_categories.category_key`).
- Schedule: trading days = **weekends skipped only** in v1 (no SG holiday calendar yet).
- Timezone: **Asia/Singapore** for digest date key and copy.
- Quote source: `https://api.sgx.com/securities/v1.1?params=nc,lt,o,h,l,pv,c,vl,v,trading_time` filter `nc == "9MT"`.
- `vl` display = `vl × 1000` shares; never call 4pm data “closing price”.
- No chart in email; single CTA to `https://investors.sgx.com/market/securities?code=9MT&type=stocks&lang=en`.
- At most one **successful** digest per SGT calendar day.
- Final fail after attempt ≥ 3: skip subscriber mail + alert admin digest recipients; no subscriber “unavailable” mail.
- No kill switch / draft-approve in v1.
- Do not invent numbers if fetch/parse fails.
- YAGNI: do **not** reuse `email_campaigns` / `email_deliveries` / `email:work` for this path — direct `mailer->send` like `AdminDigestNotifier` (list size tens–low hundreds).

---

## File map

| File | Responsibility |
|---|---|
| `backend/app/Libraries/Email/CategoryCatalog.php` | Add builtin `Press Release` |
| `src/utils/announcements.js` | Add `Press Release` to `ANNOUNCEMENT_CATEGORIES` (feeds email-alerts-form) |
| `backend/app/Libraries/Quote/MotQuote.php` | Immutable DTO for parsed 9MT fields |
| `backend/app/Libraries/Quote/MotQuoteClient.php` | HTTP fetch + parse/filter 9MT (injectable transport) |
| `backend/app/Libraries/Quote/MotQuoteFormatter.php` | Change abs/%, volume shares, subject/as-of strings |
| `backend/app/Libraries/Quote/TradingDayGate.php` | Weekend skip in Asia/Singapore |
| `backend/app/Libraries/Quote/QuoteDigestAudience.php` | Active subscribers for `Press Release` |
| `backend/app/Libraries/Quote/QuoteDigestService.php` | Orchestrate gate → fetch → send → run log → ops alert |
| `backend/app/Libraries/Quote/QuoteDigestOpsNotifier.php` | Failure email to admin recipients |
| `backend/app/Database/Migrations/2026-10-16-100000_CreateQuoteDigestRuns.php` | `quote_digest_runs` table |
| `backend/app/Models/QuoteDigestRunModel.php` | Model |
| `backend/app/Commands/QuoteDigest.php` | `php spark quote:digest` |
| `backend/app/Views/emails/mot_quote_digest.php` | Subscriber HTML body |
| `backend/app/Controllers/Admin/QuoteDigestRuns.php` | Read-only CMS list + show |
| `backend/app/Views/admin/quote_digest_runs/index.php` | History table |
| `backend/app/Views/admin/quote_digest_runs/show.php` | Detail snapshot |
| `backend/app/Config/Routes.php` | Admin routes |
| `backend/app/Views/admin/layout.php` | Nav link under Investor Emails |
| `docs/superpowers/plans/checklists/2026-10-16-quote-digest-cron.md` | Host cron snippet |

---

### Task 1: Add `Press Release` category (BE + FE)

**Files:**
- Modify: `backend/app/Libraries/Email/CategoryCatalog.php` (`KEYS` const)
- Modify: `src/utils/announcements.js` (`ANNOUNCEMENT_CATEGORIES`)
- Test: `backend/tests/unit/Email/CategoryCatalogTest.php`
- Test: `src/utils/announcements.test.mjs` (add assertion if file covers categories; else skip FE unit)

**Interfaces:**
- Consumes: none
- Produces: `CategoryCatalog::builtins()` and `ANNOUNCEMENT_CATEGORIES` both include `'Press Release'`

- [ ] **Step 1: Write the failing test**

Add to `CategoryCatalogTest.php`:

```php
public function test_builtins_include_press_release(): void
{
    $this->assertContains('Press Release', CategoryCatalog::builtins());
    $this->assertContains('Press Release', CategoryCatalog::all());
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && php vendor/bin/phpunit tests/unit/Email/CategoryCatalogTest.php --filter test_builtins_include_press_release`

Expected: FAIL (string not found)

- [ ] **Step 3: Implement**

In `CategoryCatalog.php` `KEYS`, append after `'Financial Statements'`:

```php
'Press Release',
```

In `src/utils/announcements.js` append the same string to `ANNOUNCEMENT_CATEGORIES`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && php vendor/bin/phpunit tests/unit/Email/CategoryCatalogTest.php`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Email/CategoryCatalog.php src/utils/announcements.js backend/tests/unit/Email/CategoryCatalogTest.php
git commit -m "$(cat <<'EOF'
feat(email): add Press Release subscriber category

EOF
)"
```

---

### Task 2: `MotQuote` DTO + formatter

**Files:**
- Create: `backend/app/Libraries/Quote/MotQuote.php`
- Create: `backend/app/Libraries/Quote/MotQuoteFormatter.php`
- Test: `backend/tests/unit/Quote/MotQuoteFormatterTest.php`

**Interfaces:**
- Consumes: none
- Produces:
  - `MotQuote` readonly props: `string $code`, `float $last`, `float $priorClose`, `float $open`, `float $high`, `float $low`, `float $volumeThousands`, `float $valueSgd`, `?string $tradingTime`
  - `MotQuoteFormatter::changeAbs(MotQuote $q): float`
  - `MotQuoteFormatter::changePct(MotQuote $q): float` (0.0 if priorClose == 0)
  - `MotQuoteFormatter::volumeShares(MotQuote $q): int` → `(int) round($q->volumeThousands * 1000)`
  - `MotQuoteFormatter::formatPrice(float $p): string` → e.g. `0.310` (3 dp)
  - `MotQuoteFormatter::subject(MotQuote $q, string $asOfLabel): string`
  - `MotQuoteFormatter::changeLabel(MotQuote $q): string` → `+0.005 (+1.6%)` / `unchanged` / negative

- [ ] **Step 1: Write the failing test**

```php
<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Quote\MotQuote;
use App\Libraries\Quote\MotQuoteFormatter;
use CodeIgniter\Test\CIUnitTestCase;

final class MotQuoteFormatterTest extends CIUnitTestCase
{
    public function test_volume_and_change(): void
    {
        $q = new MotQuote('9MT', 0.310, 0.305, 0.305, 0.315, 0.305, 86.8, 26800.0, '2026-10-16T12:06:00');
        $f = new MotQuoteFormatter();
        $this->assertSame(86800, $f->volumeShares($q));
        $this->assertEqualsWithDelta(0.005, $f->changeAbs($q), 1e-9);
        $this->assertEqualsWithDelta(1.639344262, $f->changePct($q), 1e-6);
        $this->assertStringContainsString('0.310', $f->subject($q, '4:00pm SGT'));
        $this->assertStringContainsString('+', $f->changeLabel($q));
    }

    public function test_unchanged_label(): void
    {
        $q = new MotQuote('9MT', 0.305, 0.305, 0.305, 0.305, 0.305, 0.0, 0.0, null);
        $this->assertSame('unchanged', (new MotQuoteFormatter())->changeLabel($q));
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && php vendor/bin/phpunit tests/unit/Quote/MotQuoteFormatterTest.php`

Expected: FAIL (class not found)

- [ ] **Step 3: Implement `MotQuote` + `MotQuoteFormatter`**

```php
// MotQuote.php — final readonly class with constructor promoting all fields listed above

// MotQuoteFormatter.php — implement methods; subject format:
// "MetaOptics (9MT) — S${price} ({changeLabel}) as of {asOfLabel}"
// changePct in label: 1 decimal place with sign, e.g. +1.6%
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && php vendor/bin/phpunit tests/unit/Quote/MotQuoteFormatterTest.php`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Quote/MotQuote.php backend/app/Libraries/Quote/MotQuoteFormatter.php backend/tests/unit/Quote/MotQuoteFormatterTest.php
git commit -m "$(cat <<'EOF'
feat(quote): add MotQuote DTO and display formatter

EOF
)"
```

---

### Task 3: `MotQuoteClient` (SGX JSON)

**Files:**
- Create: `backend/app/Libraries/Quote/MotQuoteClient.php`
- Create: `backend/app/Libraries/Quote/MotQuoteFetchException.php`
- Test: `backend/tests/unit/Quote/MotQuoteClientTest.php`

**Interfaces:**
- Consumes: `MotQuote`
- Produces:
  - `MotQuoteClient::__construct(?callable $transport = null)` where transport is `callable(string $method, string $url, array $headers): string` returning raw body (same idea as `SgxHttpClient`)
  - `MotQuoteClient::fetch9mt(): MotQuote`
  - URL constant: `https://api.sgx.com/securities/v1.1?params=nc,lt,o,h,l,pv,c,vl,v,trading_time`
  - Throws `MotQuoteFetchException` if HTTP/JSON/missing row/non-numeric `lt`|`pv`

- [ ] **Step 1: Write the failing test**

```php
public function test_parses_9mt_row(): void
{
    $json = json_encode([
        'data' => [[
            'nc' => '9MT',
            'lt' => 0.310,
            'pv' => 0.305,
            'o' => 0.305,
            'h' => 0.315,
            'l' => 0.305,
            'vl' => 86.8,
            'v' => 26800,
            'trading_time' => '2026-10-16T04:00:00',
        ]],
    ]);
    // Adjust 'data' key after inspecting a real response once — if API wraps differently,
    // support both top-level list and {data:[]} / {securities:[]} in client.
    $client = new MotQuoteClient(static fn () => $json);
    $q = $client->fetch9mt();
    $this->assertSame('9MT', $q->code);
    $this->assertEqualsWithDelta(0.310, $q->last, 1e-9);
}

public function test_missing_9mt_throws(): void
{
    $this->expectException(MotQuoteFetchException::class);
    (new MotQuoteClient(static fn () => json_encode(['data' => [['nc' => 'OTHER', 'lt' => 1, 'pv' => 1]]]))->fetch9mt();
}
```

**Important:** Before locking the decode path, run one manual curl (or temporary dump) against the live URL and match the real JSON envelope in the client. Prefer supporting: (1) JSON array of rows, (2) object with `data` array. Document the chosen shape in a one-line comment on `decodeRows()`.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && php vendor/bin/phpunit tests/unit/Quote/MotQuoteClientTest.php`

Expected: FAIL

- [ ] **Step 3: Implement client**

Default transport: CI4 `Services::curlrequest()` GET, timeout 10s, throw on non-2xx. Map row fields with `(float)` casts; require `lt` and `pv` finite numbers.

- [ ] **Step 4: Run tests — PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Quote/MotQuoteClient.php backend/app/Libraries/Quote/MotQuoteFetchException.php backend/tests/unit/Quote/MotQuoteClientTest.php
git commit -m "$(cat <<'EOF'
feat(quote): fetch and parse SGX 9MT securities JSON

EOF
)"
```

---

### Task 4: `TradingDayGate`

**Files:**
- Create: `backend/app/Libraries/Quote/TradingDayGate.php`
- Test: `backend/tests/unit/Quote/TradingDayGateTest.php`

**Interfaces:**
- Produces: `TradingDayGate::isTradingDay(\DateTimeImmutable $now): bool` — `true` iff weekday in `Asia/Singapore` (Mon–Fri). Ignore holidays in v1.

- [ ] **Step 1: Failing tests**

```php
public function test_weekday_true_weekend_false(): void
{
    $gate = new TradingDayGate();
    $fri = new \DateTimeImmutable('2026-10-16 16:00:00', new \DateTimeZone('Asia/Singapore')); // Friday
    $sat = new \DateTimeImmutable('2026-10-17 16:00:00', new \DateTimeZone('Asia/Singapore'));
    $this->assertTrue($gate->isTradingDay($fri));
    $this->assertFalse($gate->isTradingDay($sat));
}
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement** — convert `$now` to `Asia/Singapore`, `N` format 1–5 = trading.

- [ ] **Step 4: Run — PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Quote/TradingDayGate.php backend/tests/unit/Quote/TradingDayGateTest.php
git commit -m "$(cat <<'EOF'
feat(quote): weekday trading-day gate in SGT

EOF
)"
```

---

### Task 5: Migration + `QuoteDigestRunModel`

**Files:**
- Create: `backend/app/Database/Migrations/2026-10-16-100000_CreateQuoteDigestRuns.php`
- Create: `backend/app/Models/QuoteDigestRunModel.php`
- Test: `backend/tests/database/QuoteDigestRunsMigrationTest.php`

**Schema `quote_digest_runs`:**

| Column | Type |
|---|---|
| `id` | BIGINT PK AI |
| `digest_date` | DATE, **UNIQUE** |
| `status` | VARCHAR(40) — `running`,`success`,`failed`,`skipped_non_trading_day`,`skipped_no_recipients` |
| `attempt_count` | INT default 0 |
| `recipient_count` | INT default 0 |
| `sent_count` | INT default 0 |
| `failed_count` | INT default 0 |
| `last_price` | DECIMAL(12,6) null |
| `change_abs` | DECIMAL(12,6) null |
| `change_pct` | DECIMAL(12,6) null |
| `quote_json` | TEXT null |
| `error_message` | VARCHAR(1000) null |
| `started_at` | DATETIME |
| `finished_at` | DATETIME null |
| `created_at` | DATETIME null |
| `updated_at` | DATETIME null |

**Interfaces:**
- Produces: `QuoteDigestRunModel` with `$allowedFields` matching columns; `$useTimestamps = true`.

- [ ] **Step 1: Write migration test** asserting table exists + unique key on `digest_date` (follow `AnnouncementsMigrationTest` / `EmailMigrationTest` patterns).

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement migration + model**

- [ ] **Step 4: Run migration test — PASS** (`php vendor/bin/phpunit tests/database/QuoteDigestRunsMigrationTest.php`)

- [ ] **Step 5: Commit**

```bash
git add backend/app/Database/Migrations/2026-10-16-100000_CreateQuoteDigestRuns.php backend/app/Models/QuoteDigestRunModel.php backend/tests/database/QuoteDigestRunsMigrationTest.php
git commit -m "$(cat <<'EOF'
feat(quote): add quote_digest_runs table and model

EOF
)"
```

---

### Task 6: Audience resolver for Press Release

**Files:**
- Create: `backend/app/Libraries/Quote/QuoteDigestAudience.php`
- Test: `backend/tests/unit/Quote/QuoteDigestAudienceTest.php` (use `DatabaseTestTrait`)

**Interfaces:**
- Produces: `QuoteDigestAudience::activePressReleaseSubscribers(): list<array{id:int,email:string}>`
- Constant: `public const CATEGORY = 'Press Release';`

SQL pattern (same join as `AudienceResolver`):

```php
$db->table('subscribers s')
  ->select('s.id, s.email')
  ->distinct()
  ->join('subscriber_categories sc', 'sc.subscriber_id = s.id')
  ->where('s.status', 'active')
  ->where('sc.category_key', self::CATEGORY)
  ->get()->getResultArray();
```

- [ ] **Step 1: Failing test** — insert active subscriber + category row → assert count 1; inactive excluded.

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement**

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Quote/QuoteDigestAudience.php backend/tests/unit/Quote/QuoteDigestAudienceTest.php
git commit -m "$(cat <<'EOF'
feat(quote): resolve Press Release digest audience

EOF
)"
```

---

### Task 7: Email template `mot_quote_digest`

**Files:**
- Create: `backend/app/Views/emails/mot_quote_digest.php`
- Test: `backend/tests/unit/Quote/MotQuoteDigestViewTest.php`

**Interfaces:**
- View vars: `MotQuote $quote` (or preformatted array), `MotQuoteFormatter` outputs already computed in controller/service: `subject` unused in body; pass `priceLabel`, `changeLabel`, `asOfLabel`, `open`, `high`, `low`, `volumeSharesLabel`, `valueLabel`, `sgxUrl`, `unsubscribeUrl`, `preheader`
- Must `echo view('emails/_layout', [...])` like `emails/announcement.php`

Body content (locked design):
1. Title: Daily stock update — MetaOptics Ltd (SGX: 9MT)
2. Hero: price + changeLabel
3. As-of line with “Intraday (not official close)”
4. HTML table Open/High/Low/Volume/Value
5. CTA link `$sgxUrl`
6. Short disclaimer
7. Footer via layout unsubscribe

- [ ] **Step 1: Failing test** — `view('emails/mot_quote_digest', $data)` contains `0.310`, `86,800` or `86800`, `9MT`, `Intraday`, unsubscribe URL, and does **not** contain `closing price`.

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement view**

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Views/emails/mot_quote_digest.php backend/tests/unit/Quote/MotQuoteDigestViewTest.php
git commit -m "$(cat <<'EOF'
feat(quote): add daily MOT quote digest email template

EOF
)"
```

---

### Task 8: Ops failure notifier

**Files:**
- Create: `backend/app/Libraries/Quote/QuoteDigestOpsNotifier.php`
- Test: `backend/tests/unit/Quote/QuoteDigestOpsNotifierTest.php`

**Interfaces:**
- Consumes: `AdminDigestNotifier::activeEmails()` pattern (or inject mailer + recipient list)
- Produces: `notifyFailure(string $digestDate, string $reason, ?int $runId = null): void`
- Subject: `Daily 9MT digest failed — {date}`
- Body: reason + optional admin URL `site_url('admin/quote-digest-runs/'.$runId)` when id present
- Per-recipient try/catch like `AdminDigestNotifier`

- [ ] **Step 1: Failing test** with `LogMailer` temp file — insert admin recipient, call notify, assert log contains subject.

- [ ] **Step 2–4: TDD cycle**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Quote/QuoteDigestOpsNotifier.php backend/tests/unit/Quote/QuoteDigestOpsNotifierTest.php
git commit -m "$(cat <<'EOF'
feat(quote): ops alert on final quote digest failure

EOF
)"
```

---

### Task 9: `QuoteDigestService` orchestration

**Files:**
- Create: `backend/app/Libraries/Quote/QuoteDigestService.php`
- Test: `backend/tests/unit/Quote/QuoteDigestServiceTest.php`

**Interfaces:**
- Consumes: `TradingDayGate`, `MotQuoteClient`, `MotQuoteFormatter`, `QuoteDigestAudience`, `QuoteDigestOpsNotifier`, `UnsubscribeToken`, `MailerInterface`, `QuoteDigestRunModel`
- Produces: `run(?\DateTimeImmutable $now = null): array{status:string,run_id:?int,message:string}`

**Algorithm (exact):**

```
$tz = Asia/Singapore
$now = $now ?? now in $tz
$date = $now->format('Y-m-d')

$existing = model find by digest_date
if existing.status in (success, skipped_non_trading_day, skipped_no_recipients):
  return early noop

if !gate.isTradingDay(now):
  upsert status skipped_non_trading_day, attempt_count=0, finished
  return

$attempt = existing ? existing.attempt_count + 1 : 1
if attempt > 3:
  return early (already exhausted)

upsert row: status=running, attempt_count=$attempt, started_at if new

try:
  $quote = client.fetch9mt()
  $subs = audience.activePressReleaseSubscribers()
  if subs empty:
    mark skipped_no_recipients + quote snapshot fields, finished
    return  // NO ops alert

  $sent=0; $failed=0
  foreach sub:
    build unsub URL; render view; mailer->send; catch → failed++
    else sent++
  mark success, recipient_count=count(subs), sent_count, failed_count, quote fields, quote_json, finished
  return

catch MotQuoteFetchException|Throwable as e:
  mark failed, error_message=substr(e.message,0,1000), finished
  if attempt >= 3: opsNotifier.notifyFailure(date, message, runId)
  return
```

Max attempts = **3** (cron 16:00, 16:05, 16:15).

As-of label for subject: prefer quote `tradingTime` formatted; else `$now->format('g:ia') . ' SGT'`.

- [ ] **Step 1: Tests (DatabaseTestTrait + fake transport + LogMailer)**
  1. Weekend → `skipped_non_trading_day`, no mail
  2. Weekday + mock quote + 1 subscriber → `success`, mail log has subject
  3. Weekday + mock quote + 0 subscribers → `skipped_no_recipients`, no ops subject
  4. Fetch throws twice then… use attempt_count: call run 3 times with failing client → 3rd triggers ops subject `Daily 9MT digest failed`
  5. After success, second `run()` same day is noop (status stays success, no duplicate sent)

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement service**

Constructor injection optional; default `new` collaborators for CLI simplicity, allow test overrides via constructor params.

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Quote/QuoteDigestService.php backend/tests/unit/Quote/QuoteDigestServiceTest.php
git commit -m "$(cat <<'EOF'
feat(quote): orchestrate daily 9MT digest with retries

EOF
)"
```

---

### Task 10: CLI `quote:digest`

**Files:**
- Create: `backend/app/Commands/QuoteDigest.php`
- Test: optional feature smoke — or invoke service in unit only; add thin command test if project has CLI test helpers; otherwise manual `php spark quote:digest` in checklist.

**Interfaces:**
- Command name: `quote:digest`
- Group: `Quote`
- `run()`: `$out = (new QuoteDigestService())->run();` CLI::write status; return EXIT_SUCCESS unless unexpected fatal

- [ ] **Step 1: Implement command** (mirror `SgxSync.php` structure)

- [ ] **Step 2: Run** `cd backend && php spark list` — expect `quote:digest` listed

- [ ] **Step 3: Commit**

```bash
git add backend/app/Commands/QuoteDigest.php
git commit -m "$(cat <<'EOF'
feat(quote): add spark quote:digest command

EOF
)"
```

---

### Task 11: Admin history UI

**Files:**
- Create: `backend/app/Controllers/Admin/QuoteDigestRuns.php`
- Create: `backend/app/Views/admin/quote_digest_runs/index.php`
- Create: `backend/app/Views/admin/quote_digest_runs/show.php`
- Modify: `backend/app/Config/Routes.php`
- Modify: `backend/app/Views/admin/layout.php`
- Test: `backend/tests/feature/Admin/QuoteDigestRunsAdminTest.php`

**Routes (inside adminAuth group):**

```php
$routes->get('quote-digest-runs', 'Admin\QuoteDigestRuns::index');
$routes->get('quote-digest-runs/(:num)', 'Admin\QuoteDigestRuns::show/$1');
```

**Nav:** under Investor Emails, after Email Alerts:

```html
<a class="nav-item ..." href="<?= site_url('admin/quote-digest-runs') ?>">Daily stock digest</a>
```

**Index:** table Date · Status pill · Recipients · Last · Change · Finished · link View  
**Show:** kv snapshot + `quote_json` in `<pre>` + error

Match existing admin redesign classes (`page-head`, `pill`, `tbl`, `note`).

- [ ] **Step 1: Feature test** — login as admin (copy auth from `SubscribersAdminTest`), seed one run row, GET index assert 200 + date; GET show assert last price.

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement controller/views/routes/nav**

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Controllers/Admin/QuoteDigestRuns.php backend/app/Views/admin/quote_digest_runs/ backend/app/Config/Routes.php backend/app/Views/admin/layout.php backend/tests/feature/Admin/QuoteDigestRunsAdminTest.php
git commit -m "$(cat <<'EOF'
feat(admin): read-only daily stock digest history

EOF
)"
```

---

### Task 12: Cron checklist + design follow-up note

**Files:**
- Create: `docs/superpowers/plans/checklists/2026-10-16-quote-digest-cron.md`
- Modify: `docs/superpowers/designs/2026-10-16-daily-mot-quote-digest.md` — add “Implemented plan: …” link at top when done (optional one-liner)

**Cron (host timezone must be Asia/Singapore OR use `TZ=Asia/Singapore`):**

```cron
0 16 * * 1-5 cd /path/to/backend && php spark quote:digest >> writable/logs/quote-digest.log 2>&1
5 16 * * 1-5 cd /path/to/backend && php spark quote:digest >> writable/logs/quote-digest.log 2>&1
15 16 * * 1-5 cd /path/to/backend && php spark quote:digest >> writable/logs/quote-digest.log 2>&1
```

Checklist items: migrate DB; verify category on FE form; subscribe test mailbox to Press Release; dry-run weekday with LogMailer; confirm weekend skip; confirm 3rd failure emails ops recipients.

- [ ] **Step 1: Write checklist file**

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/plans/checklists/2026-10-16-quote-digest-cron.md
git commit -m "$(cat <<'EOF'
docs(quote): cron and staging checklist for daily digest

EOF
)"
```

---

## Self-review (spec coverage)

| Spec item | Task |
|---|---|
| Press Release category BE+FE | T1 |
| Quote fields + volume×1000 + subject copy | T2, T7 |
| SGX JSON fetch | T3 |
| Weekends-only trading gate | T4 |
| Run log table | T5 |
| Audience Press Release | T6 |
| Email UX no chart + SGX CTA + disclaimer | T7 |
| Retry ×3 then ops alert | T8, T9 |
| Idempotent success/day | T9 |
| CLI | T10 |
| CMS history | T11 |
| Cron docs | T12 |
| No kill switch / no campaign table | Global + T9 |
| Holiday calendar | Out of scope (follow-up) |

**Placeholder scan:** none intentionally left as TBD except live JSON envelope note in T3 (must be resolved during T3 by inspecting one response).

**Type consistency:** `MotQuote` / `MotQuoteFormatter` / `QuoteDigestService::run(): array{status,run_id,message}` used throughout.

---
