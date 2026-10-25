# SGX Sync Auto-Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When `sgx.autoPublish=true`, brand-new SGX sync inserts go live (`published` + `live_at`), trigger one Cloudflare deploy hook, and email admins with auto-publish copy; on hook failure roll those rows back to `pending_review` and notify with a failure digest.

**Architecture:** Keep `SyncService` inserting non-backfill rows as `pending_review` and return `newIds`. Post-step `AutoPublishNewItems` in `SgxSyncRunner` publishes only those ids, calls `FeDeployHook::attempt()` once, digests via `AdminDigestNotifier` modes. Do **not** call `PublishToLiveSiteService::run()` (it lives all published rows).

**Tech Stack:** CodeIgniter 4 (PHP 8.x), existing `FeDeployHook`, `AdminDigestNotifier`, PHPUnit + DatabaseTestTrait.

**Spec:** `docs/superpowers/designs/2026-10-20-sgx-auto-publish.md`

## Global Constraints

- Env flag: `sgx.autoPublish` bool, **default false** (`Config\Sgx::$autoPublish`).
- Scope: **only ids inserted this sync run** (`SyncResult::$newIds`); never bulk-live existing `pending_review`.
- Full live on success: `state=published`, `published_at` set, `live_at` set, `needs_review=0`.
- Empty `fe.deployHookURL` = deploy **failure** for auto-publish (rollback). Existing `FeDeployHook::trigger()` fire-and-forget for manual Publish-to-live stays unchanged.
- CF fail / attempt false → rollback those `newIds` to `pending_review`, clear `published_at` + `live_at`.
- `sgx.backfill=true` → ignore auto-publish (keep today’s backfill + no digest behavior).
- Digest modes: `review` | `auto_published` | `auto_publish_failed` (exact strings).
- Pass real refs (prefer `sgx_reference`) into digests — not empty arrays when ids exist.
- No investor Email Alerts automation.
- YAGNI: no new CMS UI; unpublish/preview = existing admin flows.

---

## File map

| File | Responsibility |
|---|---|
| `backend/app/Config/Sgx.php` | `$autoPublish` from env |
| `backend/app/Libraries/Sgx/SyncResult.php` | Add `newIds: list<int>` |
| `backend/app/Libraries/Sgx/SyncService.php` | Collect insert ids into `newIds` |
| `backend/app/Libraries/Admin/FeDeployHook.php` | Add `attempt(string $reason): bool` |
| `backend/app/Libraries/Admin/AdminDigestNotifier.php` | `notifyNewItems(..., string $mode = 'review')` |
| `backend/app/Views/emails/admin_digest.php` | Mode-based subject/body copy |
| `backend/app/Libraries/Admin/AutoPublishNewItems.php` | Publish ids → attempt hook → digest / rollback |
| `backend/app/Libraries/Sgx/SgxSyncRunner.php` | Branch on autoPublish after sync |
| `backend/.env.example` (or README snippet) | Document `sgx.autoPublish` |
| `docs/superpowers/plans/checklists/2026-10-20-sgx-auto-publish.md` | Staging checklist |

---

### Task 1: `Config\Sgx::$autoPublish`

**Files:**
- Modify: `backend/app/Config/Sgx.php`
- Test: `backend/tests/unit/Sgx/SgxConfigAutoPublishTest.php` (create)

**Interfaces:**
- Consumes: `env('sgx.autoPublish', false)` via `filter_var(..., FILTER_VALIDATE_BOOLEAN)` (same pattern as `$backfill`)
- Produces: `public bool $autoPublish = false` on `Config\Sgx`

- [ ] **Step 1: Write the failing test**

```php
<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use CodeIgniter\Test\CIUnitTestCase;
use Config\Sgx;

final class SgxConfigAutoPublishTest extends CIUnitTestCase
{
    public function test_auto_publish_defaults_false(): void
    {
        putenv('sgx.autoPublish');
        unset($_ENV['sgx.autoPublish'], $_SERVER['sgx.autoPublish']);
        $cfg = new Sgx();
        $this->assertFalse($cfg->autoPublish);
    }

    public function test_auto_publish_env_true(): void
    {
        putenv('sgx.autoPublish=true');
        $_ENV['sgx.autoPublish'] = 'true';
        $cfg = new Sgx();
        $this->assertTrue($cfg->autoPublish);
        putenv('sgx.autoPublish');
        unset($_ENV['sgx.autoPublish'], $_SERVER['sgx.autoPublish']);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Sgx/SgxConfigAutoPublishTest.php`

Expected: FAIL (property / constructor missing)

- [ ] **Step 3: Implement**

In `Config\Sgx`:

```php
public bool $autoPublish = false;
```

In `__construct()`, after `$this->backfill = ...`:

```php
$this->autoPublish = filter_var(env('sgx.autoPublish', false), FILTER_VALIDATE_BOOLEAN);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Sgx/SgxConfigAutoPublishTest.php`  
Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Config/Sgx.php backend/tests/unit/Sgx/SgxConfigAutoPublishTest.php
git commit -m "$(cat <<'EOF'
feat(sgx): add sgx.autoPublish config flag

EOF
)"
```

---

### Task 2: `SyncResult::$newIds` + collect on insert

**Files:**
- Modify: `backend/app/Libraries/Sgx/SyncResult.php`
- Modify: `backend/app/Libraries/Sgx/SyncService.php` (`run`, `upsertAll`)
- Test: `backend/tests/unit/Sgx/SyncServiceTest.php`

**Interfaces:**
- Consumes: existing insert path in `upsertAll`
- Produces: `new SyncResult(int $fetchedCount, int $newCount, int $updatedCount, array $newIds = [])` where `$newIds` is `list<int>` of inserted announcement ids; `count($newIds) === $newCount`

- [ ] **Step 1: Extend failing assertions in `SyncServiceTest`**

In `test_incremental_inserts_pending_review` (or equivalent first-insert test), after asserting `newCount` and `pending_review`:

```php
$this->assertCount(1, $result->newIds);
$row = /* same row look up as existing test */;
$this->assertSame([(int) $row['id']], $result->newIds);
```

In the second-run / no-new test (`newCount === 0`):

```php
$this->assertSame([], $again->newIds);
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage --filter newIds tests/unit/Sgx/SyncServiceTest.php`  
(or full file if filter misses)

Expected: FAIL — `Undefined property newIds` or wrong constructor arity

- [ ] **Step 3: Implement `SyncResult`**

```php
final class SyncResult
{
    /** @param list<int> $newIds */
    public function __construct(
        public int $fetchedCount,
        public int $newCount,
        public int $updatedCount,
        public array $newIds = [],
    ) {}
}
```

- [ ] **Step 4: Implement collection in `SyncService`**

Change `upsertAll` to return `[$newCount, $updatedCount, $newIds]`.

On successful insert:

```php
$id = (int) $this->announcements->insert($core, true);
// ... writeDetails ...
$newIds[] = $id;
$newCount++;
```

In `run()`:

```php
[$newCount, $updatedCount, $newIds] = $this->upsertAll($normalized, $now);
// ...
return new SyncResult($fetchedCount, $newCount, $updatedCount, $newIds);
```

Do **not** push ids for update-only / hash-change paths.

- [ ] **Step 5: Run `SyncServiceTest` full file**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Sgx/SyncServiceTest.php`  
Expected: OK

- [ ] **Step 6: Commit**

```bash
git add backend/app/Libraries/Sgx/SyncResult.php backend/app/Libraries/Sgx/SyncService.php backend/tests/unit/Sgx/SyncServiceTest.php
git commit -m "$(cat <<'EOF'
feat(sgx): return newIds from SyncService inserts

EOF
)"
```

---

### Task 3: `FeDeployHook::attempt(): bool`

**Files:**
- Modify: `backend/app/Libraries/Admin/FeDeployHook.php`
- Test: `backend/tests/unit/Admin/FeDeployHookTest.php`

**Interfaces:**
- Consumes: existing poster callable
- Produces: `attempt(string $reason): bool` — `true` only if URL non-empty and poster returns `ok=true`; `false` if URL empty, poster `ok=false`, or exception. Does **not** change `trigger()` behavior (empty URL still noop success for manual live).

- [ ] **Step 1: Write failing tests**

```php
public function test_attempt_empty_url_returns_false(): void
{
    $called = false;
    $hook = new FeDeployHook('', 5, static function () use (&$called): array {
        $called = true;
        return ['ok' => true, 'status' => 200];
    });
    $this->assertFalse($hook->attempt('sgx_auto_publish'));
    $this->assertFalse($called);
}

public function test_attempt_ok_returns_true(): void
{
    $hook = new FeDeployHook('https://hooks.example.test/deploy', 5, static function (): array {
        return ['ok' => true, 'status' => 204];
    });
    $this->assertTrue($hook->attempt('sgx_auto_publish'));
}

public function test_attempt_http_fail_returns_false(): void
{
    $hook = new FeDeployHook('https://hooks.example.test/deploy', 5, static function (): array {
        return ['ok' => false, 'status' => 500, 'error' => 'HTTP 500'];
    });
    $this->assertFalse($hook->attempt('sgx_auto_publish'));
}
```

- [ ] **Step 2: Run to verify fail**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage --filter attempt tests/unit/Admin/FeDeployHookTest.php`  
Expected: FAIL — method missing

- [ ] **Step 3: Implement `attempt`**

Refactor shared post logic so `trigger` and `attempt` both use it; example:

```php
public function attempt(string $reason): bool
{
    if ($this->url === '') {
        log_message('error', 'fe.deployHook attempt failed reason=' . $reason . ' error=empty_url');

        return false;
    }

    try {
        $result = ($this->poster)($this->url, $this->timeoutSeconds);
        if (($result['ok'] ?? false) === true) {
            log_message('info', 'fe.deployHook ok reason=' . $reason . ' status=' . (string) ($result['status'] ?? ''));

            return true;
        }
        log_message(
            'error',
            'fe.deployHook failed reason=' . $reason
            . ' status=' . (string) ($result['status'] ?? '')
            . ' error=' . (string) ($result['error'] ?? 'unknown')
        );

        return false;
    } catch (Throwable $e) {
        log_message('error', 'fe.deployHook exception reason=' . $reason . ': ' . $e->getMessage());

        return false;
    }
}

public function trigger(string $reason): void
{
    if ($this->url === '') {
        return;
    }
    // keep existing fire-and-forget semantics (ignore bool)
    $this->attempt($reason);
}
```

Note: after this refactor, `trigger` with empty URL still returns immediately without calling `attempt` (preserve `test_empty_url_is_noop`). Only `attempt` treats empty as failure.

Correct split:

```php
public function trigger(string $reason): void
{
    if ($this->url === '') {
        return;
    }
    $this->attempt($reason); // ignore return
}

public function attempt(string $reason): bool
{
    if ($this->url === '') {
        log_message('error', 'fe.deployHook attempt failed reason=' . $reason . ' error=empty_url');
        return false;
    }
    // try poster... return bool
}
```

- [ ] **Step 4: Run full FeDeployHookTest**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/FeDeployHookTest.php`  
Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Admin/FeDeployHook.php backend/tests/unit/Admin/FeDeployHookTest.php
git commit -m "$(cat <<'EOF'
feat(admin): FeDeployHook::attempt returns deploy success bool

EOF
)"
```

---

### Task 4: Admin digest modes

**Files:**
- Modify: `backend/app/Libraries/Admin/AdminDigestNotifier.php`
- Modify: `backend/app/Views/emails/admin_digest.php`
- Test: `backend/tests/unit/Admin/AdminDigestNotifierTest.php`

**Interfaces:**
- Consumes: existing `activeEmails()`, `Services::mailer()`
- Produces: `notifyNewItems(int $newCount, array $refs, string $mode = 'review'): void`  
  Allowed `$mode`: `review` | `auto_published` | `auto_publish_failed` (unknown → treat as `review`)

**Copy (exact intent):**

| mode | subject | body CTA |
|---|---|---|
| `review` | `[IR] {N} new SGX announcement(s)` | “pending review” + “Sign in … to review and publish.” (current) |
| `auto_published` | `[IR] {N} announcement(s) auto-published` | auto-published + CF rebuild triggered; admin may unpublish in CMS |
| `auto_publish_failed` | `[IR] {N} announcement(s) need review (auto-publish failed)` | sync OK but publish/rebuild failed; still pending review |

- [ ] **Step 1: Write failing tests**

Keep existing review-mode test (default mode). Add:

```php
public function test_auto_published_mode_subject_and_body(): void
{
    (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
    $logPath = WRITEPATH . 'logs/mail-digest-ap-' . bin2hex(random_bytes(4)) . '.log';
    Services::injectMock('mailer', new LogMailer($logPath));
    try {
        (new AdminDigestNotifier())->notifyNewItems(1, ['REF-A'], 'auto_published');
        $row = json_decode((string) file_get_contents($logPath), true);
        $this->assertSame('[IR] 1 announcement(s) auto-published', $row['subject']);
        $this->assertStringContainsString('auto-published', strtolower((string) $row['textBody']));
        $this->assertStringContainsString('REF-A', (string) $row['textBody']);
    } finally {
        if (is_file($logPath)) {
            unlink($logPath);
        }
        Services::reset(true);
    }
}

public function test_auto_publish_failed_mode_subject(): void
{
    (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
    $logPath = WRITEPATH . 'logs/mail-digest-af-' . bin2hex(random_bytes(4)) . '.log';
    Services::injectMock('mailer', new LogMailer($logPath));
    try {
        (new AdminDigestNotifier())->notifyNewItems(2, ['REF-B'], 'auto_publish_failed');
        $row = json_decode((string) file_get_contents($logPath), true);
        $this->assertSame('[IR] 2 announcement(s) need review (auto-publish failed)', $row['subject']);
        $this->assertStringContainsString('failed', strtolower((string) $row['textBody']));
    } finally {
        if (is_file($logPath)) {
            unlink($logPath);
        }
        Services::reset(true);
    }
}
```

- [ ] **Step 2: Run to verify fail**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/AdminDigestNotifierTest.php`  
Expected: FAIL on new mode assertions / arity

- [ ] **Step 3: Implement notifier + view**

```php
/** @param list<string> $refs */
public function notifyNewItems(int $newCount, array $refs, string $mode = 'review'): void
{
    // ... early returns unchanged ...
    if (! in_array($mode, ['review', 'auto_published', 'auto_publish_failed'], true)) {
        $mode = 'review';
    }
    [$subject, $preheader] = match ($mode) {
        'auto_published' => [
            sprintf('[IR] %d announcement(s) auto-published', $newCount),
            'Auto-published · Cloudflare rebuild triggered',
        ],
        'auto_publish_failed' => [
            sprintf('[IR] %d announcement(s) need review (auto-publish failed)', $newCount),
            'Auto-publish failed · review in Admin CMS',
        ],
        default => [
            sprintf('[IR] %d new SGX announcement(s)', $newCount),
            'Internal digest · review in Admin CMS',
        ],
    };
    $htmlBody = (string) view('emails/admin_digest', [
        'newCount' => $newCount,
        'refs' => $refs,
        'mode' => $mode,
    ]);
    // textBody: short plain mirror of mode CTA + refs
    // mailer loop unchanged
}
```

Update `admin_digest.php` to branch intro/footer paragraphs on `$mode` (default `review` for BC). Pass `$emailTitle` / `$preheader` consistent with mode (view already builds title from count — align with subject intent).

- [ ] **Step 4: Run tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/AdminDigestNotifierTest.php`  
Expected: OK (also re-run `AdminRecipientTest` if it calls `notifyNewItems`)

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/AdminRecipientTest.php`  
Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Admin/AdminDigestNotifier.php backend/app/Views/emails/admin_digest.php backend/tests/unit/Admin/AdminDigestNotifierTest.php
git commit -m "$(cat <<'EOF'
feat(admin): digest modes for SGX auto-publish outcomes

EOF
)"
```

---

### Task 5: `AutoPublishNewItems`

**Files:**
- Create: `backend/app/Libraries/Admin/AutoPublishNewItems.php`
- Test: `backend/tests/unit/Admin/AutoPublishNewItemsTest.php`

**Interfaces:**
- Consumes: `FeDeployHook::attempt`, `AdminDigestNotifier::notifyNewItems`, `AnnouncementModel`
- Produces:

```php
final class AutoPublishNewItems
{
    public function __construct(
        private readonly FeDeployHook $deployHook,
        private readonly AdminDigestNotifier $notifier = new AdminDigestNotifier(),
    ) {}

    /**
     * @param list<int> $newIds
     * @return 'auto_published'|'auto_publish_failed'|null  null if $newIds empty
     */
    public function run(array $newIds): ?string
}
```

Algorithm (exact):

```
if newIds empty → return null
now = date('Y-m-d H:i:s')
UPDATE announcements WHERE id IN newIds
  SET state=published, published_at=now, live_at=now, needs_review=0
ok = deployHook.attempt('sgx_auto_publish')
refs = sgx_reference list for those ids (ordered by id)
if ok:
  notifier.notifyNewItems(count, refs, 'auto_published')
  return 'auto_published'
else:
  UPDATE those ids SET state=pending_review, published_at=NULL, live_at=NULL, needs_review=0
  notifier.notifyNewItems(count, refs, 'auto_publish_failed')
  return 'auto_publish_failed'
```

- [ ] **Step 1: Write failing tests**

```php
public function test_empty_ids_noop(): void
{
    $hook = new FeDeployHook('https://h.test', 5, static fn (): array => ['ok' => true, 'status' => 200]);
    $this->assertNull((new AutoPublishNewItems($hook))->run([]));
}

public function test_success_sets_live_and_digests(): void
{
    // insert 1 pending_review row, capture id
    // inject LogMailer + active admin recipient
    $calls = 0;
    $hook = new FeDeployHook('https://h.test', 5, static function () use (&$calls): array {
        $calls++;
        return ['ok' => true, 'status' => 204];
    });
    $mode = (new AutoPublishNewItems($hook))->run([$id]);
    $this->assertSame('auto_published', $mode);
    $this->assertSame(1, $calls);
    $row = model(AnnouncementModel::class)->find($id);
    $this->assertSame('published', $row['state']);
    $this->assertNotNull($row['live_at']);
    $this->assertNotNull($row['published_at']);
    // assert mail subject contains auto-published
}

public function test_hook_fail_rolls_back_to_pending_review(): void
{
    // insert pending id
    $hook = new FeDeployHook('https://h.test', 5, static fn (): array => ['ok' => false, 'status' => 500]);
    $mode = (new AutoPublishNewItems($hook))->run([$id]);
    $this->assertSame('auto_publish_failed', $mode);
    $row = model(AnnouncementModel::class)->find($id);
    $this->assertSame('pending_review', $row['state']);
    $this->assertNull($row['live_at']);
    $this->assertNull($row['published_at']);
}

public function test_empty_hook_url_rolls_back(): void
{
    $hook = new FeDeployHook('', 5, static fn (): array => ['ok' => true, 'status' => 200]);
    $mode = (new AutoPublishNewItems($hook))->run([$id]);
    $this->assertSame('auto_publish_failed', $mode);
    // row pending_review again
}
```

Use DatabaseTestTrait; seed minimal announcement columns required by model (mirror other Admin announcement tests).

- [ ] **Step 2: Run to verify fail**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/AutoPublishNewItemsTest.php`  
Expected: FAIL — class missing

- [ ] **Step 3: Implement `AutoPublishNewItems.php`** as algorithm above

- [ ] **Step 4: Run tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/AutoPublishNewItemsTest.php`  
Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Admin/AutoPublishNewItems.php backend/tests/unit/Admin/AutoPublishNewItemsTest.php
git commit -m "$(cat <<'EOF'
feat(admin): auto-publish new SGX ids with CF attempt + rollback

EOF
)"
```

---

### Task 6: Wire `SgxSyncRunner`

**Files:**
- Modify: `backend/app/Libraries/Sgx/SgxSyncRunner.php`
- Test: `backend/tests/unit/Sgx/SgxSyncRunnerTest.php`

**Interfaces:**
- Consumes: `SyncResult::$newIds`, `Config\Sgx::$autoPublish` / `$backfill`, `AutoPublishNewItems`, `AdminDigestNotifier`, `FeDeployHook::fromConfig()` (or injectable hook in tests)
- Produces: after successful sync:

```
if (!$sgx->backfill && $result->newCount > 0):
  if ($sgx->autoPublish && $result->newIds !== []):
    (new AutoPublishNewItems($hook))->run($result->newIds)
  else:
    notifier.notifyNewItems($result->newCount, $refsFromNewIdsOrEmpty, 'review')
```

Prefer building `$refs` from DB for `newIds` even in review mode (improvement over today’s `[]`).

For tests: inject fake client + set `$cfg->autoPublish` / `backfill` on `config(Sgx::class)`; inject `FeDeployHook` via optional constructor param on runner **or** construct `AutoPublishNewItems` inside runner with `FeDeployHook` from a new optional `$deployHook` ctor arg:

```php
public function __construct(
    private readonly ?BaseConnection $db = null,
    private readonly mixed $client = null,
    private readonly ?FeDeployHook $deployHook = null,
) {}
```

When autoPublish path runs, use `$this->deployHook ?? FeDeployHook::fromConfig()`.

- [ ] **Step 1: Write failing runner tests**

```php
public function test_auto_publish_on_new_items_lives_and_hooks_once(): void
{
    $cfg = config(Sgx::class);
    $cfg->fetchDetailHtml = false;
    $cfg->backfill = false;
    $cfg->autoPublish = true;
    // fake client returning 1 list item (fixture)
    // FeDeployHook mock counting calls, ok=true
    // seed active admin + LogMailer optional
    $out = (new SgxSyncRunner(null, null, $hook))->run();
    $this->assertTrue($out['ok']);
    $this->assertSame(1, $hookCalls);
    $row = /* find by sgx_reference from fixture */;
    $this->assertSame('published', $row['state']);
    $this->assertNotNull($row['live_at']);
}

public function test_auto_publish_off_keeps_pending_review(): void
{
    $cfg->autoPublish = false;
    $cfg->backfill = false;
    // ...
    $this->assertSame('pending_review', $row['state']);
}

public function test_auto_publish_hook_fail_leaves_pending_review(): void
{
    $cfg->autoPublish = true;
    $hook = new FeDeployHook('https://h.test', 5, static fn (): array => ['ok' => false, 'status' => 500]);
    // run...
    $this->assertSame('pending_review', $row['state']);
}
```

Reuse fixture `SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'` carefully: with `backfill=false` and `autoPublish=true`, expect published; with existing `test_run_success_writes_sync_run` keep `backfill=true` (must remain unaffected by autoPublish).

- [ ] **Step 2: Run to verify fail**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Sgx/SgxSyncRunnerTest.php`  
Expected: FAIL on new tests / ctor arity

- [ ] **Step 3: Implement runner branch**

Replace current:

```php
if (! $sgx->backfill && $result->newCount > 0) {
    (new AdminDigestNotifier())->notifyNewItems($result->newCount, []);
}
```

With auto-publish branch per Interfaces above. Never call `PublishToLiveSiteService`.

- [ ] **Step 4: Run runner + related suites**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Sgx/SgxSyncRunnerTest.php \
  tests/unit/Sgx/SyncServiceTest.php \
  tests/unit/Admin/AutoPublishNewItemsTest.php \
  tests/unit/Admin/FeDeployHookTest.php \
  tests/unit/Admin/AdminDigestNotifierTest.php
```

Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Sgx/SgxSyncRunner.php backend/tests/unit/Sgx/SgxSyncRunnerTest.php
git commit -m "$(cat <<'EOF'
feat(sgx): wire auto-publish after sync for new ids

EOF
)"
```

---

### Task 7: Ops docs + env example

**Files:**
- Create: `docs/superpowers/plans/checklists/2026-10-20-sgx-auto-publish.md`
- Modify: `backend/README.md` (SGX sync section — add autoPublish note next to existing cron) **or** `backend/.env.example` if that file documents `sgx.*` keys

**Interfaces:** none (docs only)

- [ ] **Step 1: Write checklist** covering:

```markdown
# SGX auto-publish staging checklist

- [ ] `sgx.autoPublish=false` (default): new sync → pending_review + review digest
- [ ] Set `sgx.autoPublish=true` and `fe.deployHookURL=<staging hook>`
- [ ] Run `php spark sgx:sync` with a known-new SGX item (or fixture in staging)
- [ ] Row: state=published, live_at set; CF Pages rebuild started
- [ ] Admin mail: subject contains `auto-published`
- [ ] Unset/wrong hook URL: row stays/returns pending_review; subject contains `auto-publish failed`
- [ ] Existing pending_review rows unchanged when flag flipped on
- [ ] `sgx.backfill=true` still ignores auto-publish path
```

- [ ] **Step 2: Document env**

```env
# When true, NEW sgx:sync inserts go live + CF deploy hook; default false
sgx.autoPublish = false
```

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/checklists/2026-10-20-sgx-auto-publish.md backend/README.md
# and/or backend/.env.example
git commit -m "$(cat <<'EOF'
docs(sgx): auto-publish env flag and staging checklist

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| `sgx.autoPublish` default false | T1 |
| Only new insert ids | T2 + T5 + T6 |
| published + live_at + CF once | T5 |
| Empty URL / hook fail → rollback + failure digest | T3 + T5 |
| Digest modes review / auto_published / auto_publish_failed | T4 |
| backfill ignores auto-publish | T6 |
| No PublishToLiveSiteService | T5–T6 |
| No investor alerts | (non-goal; no task) |
| Staging checklist | T7 |

## Type consistency

- `SyncResult::$newIds: list<int>`
- Digest modes exact: `review` | `auto_published` | `auto_publish_failed`
- Hook reason string: `sgx_auto_publish`
- `AutoPublishNewItems::run(): ?string` return values match digest modes or `null`
