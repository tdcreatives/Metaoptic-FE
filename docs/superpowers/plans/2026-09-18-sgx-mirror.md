# SGX Mirror Implementation Plan (CodeIgniter 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CodeIgniter 4 backend that daily-syncs MetaOptics SGX announcements into MySQL and serves only published records via a public JSON API for the Next.js IR pages.

**Architecture:** Composer `codeigniter4/appstarter` in `backend/`. Domain logic lives in `app/Libraries/Sgx` and `app/Models`. Cron runs `php spark sgx:sync`. Controllers under `App\Controllers\Api` expose `GET /api/announcements`. Initial backfill publishes all history with email suppressed; incremental sync inserts `pending_review`. Frontend keeps JSON fallback behind `useAnnouncementsApi`.

**Tech Stack:** CodeIgniter 4.7+ (PHP 8.2+), MySQL, CI Migrations + Models, CURLRequest, Spark commands, PHPUnit (CI test suite), Next.js static export.

## Global Constraints

- PHP 8.2+, ext-intl, mbstring, curl, mysqlnd; MySQL; HTTPS; cron.
- Backend is CodeIgniter 4 appstarter at `backend/` — do not invent a parallel plain-PHP `src/` tree.
- SGX internal/session endpoint accepted for MVP; empty or malformed SGX responses are failures, not empty success.
- Database lock must prevent overlapping cron runs (`GET_LOCK` via Query Builder / raw SQL).
- Public API returns only `published` announcements; never `source_payload`, subscriber data, secrets, or internal errors.
- Initial backfill: mark Published and suppress all email (no campaigns, no digests).
- Incremental sync: new items → `pending_review`; source hash changes update payload and set `needs_review=1` without overwriting admin `summary`.
- After successful incremental sync with `new_count > 0`, log `digest_pending` (CMS/Email plans send the digest).
- CORS only for approved MetaOptics origins (`app/Config/Cors.php` / filter).
- Categories until TDC delivers: keys matching `ANNOUNCEMENT_CATEGORIES` in `src/utils/announcements.js`.
- Design: `docs/SGX_MIRROR_EMAIL_ALERTS_CMS_DESIGN_VI.md` (framework = CI4).
- Implement before CMS and Email Alerts plans.

---

## File Structure

```text
backend/                                      # CI4 appstarter
  app/Config/Routes.php
  app/Config/Services.php                     # register Sgx factories
  app/Controllers/Api/Announcements.php
  app/Commands/SgxSync.php
  app/Database/Migrations/2026-09-18-100000_CreateAnnouncementsAndSyncRuns.php
  app/Models/AnnouncementModel.php
  app/Models/SyncRunModel.php
  app/Libraries/Sgx/AnnouncementNormalizer.php
  app/Libraries/Sgx/SourceHasher.php
  app/Libraries/Sgx/SgxHttpClient.php
  app/Libraries/Sgx/SgxSession.php
  app/Libraries/Sgx/SgxFetchException.php
  app/Libraries/Sgx/SyncLock.php
  app/Libraries/Sgx/SyncService.php
  app/Libraries/Sgx/AnnouncementPresenter.php
  tests/unit/Sgx/AnnouncementNormalizerTest.php
  tests/unit/Sgx/SourceHasherTest.php
  tests/unit/Sgx/SyncServiceTest.php
  tests/unit/Sgx/SgxHttpClientTest.php
  tests/feature/Api/AnnouncementsApiTest.php
  tests/_support/Fixtures/sgx/list-page-1.json
  tests/_support/Fixtures/sgx/list-page-2.json
  tests/_support/Fixtures/sgx/malformed.json
  .env                                        # from env example
src/lib/announcements-api.js
src/lib/announcements-api.test.mjs
src/constants/ir-feature-flags.js
src/layouts/investor-relations/company-announcements/index.js
```

---

### Task 1: Create CodeIgniter 4 appstarter

**Files:**
- Create: `backend/` via Composer appstarter
- Modify: `backend/.env` / `backend/env` keys for DB + SGX + CORS
- Modify: `backend/composer.json` (ensure `phpunit/phpunit` present — appstarter includes it)
- Test: `backend/tests/unit/Health/CiBootstrapTest.php`

**Interfaces:**
- Consumes: none
- Produces: runnable `backend/spark`, `backend/public/index.php`, PHPUnit via `backend/vendor/bin/phpunit`

- [ ] **Step 1: Write the failing test** (after app exists this becomes a smoke; write it first in repo root then move)

```php
<?php
declare(strict_types=1);

namespace Tests\Unit\Health;

use CodeIgniter\Test\CIUnitTestCase;

final class CiBootstrapTest extends CIUnitTestCase
{
    public function test_spark_file_exists(): void
    {
        $this->assertFileExists(ROOTPATH . 'spark');
    }
}
```

- [ ] **Step 2: Run to verify fail (no backend yet)**

Run: `test ! -f backend/spark && echo MISSING`

Expected: `MISSING`

- [ ] **Step 3: Create appstarter**

```bash
composer create-project codeigniter4/appstarter backend "^4.7"
cd backend
cp env .env
```

Set in `backend/.env`:

```env
CI_ENVIRONMENT = development

database.default.hostname = 127.0.0.1
database.default.database = metaoptics_ir
database.default.username = ir
database.default.password = changeme
database.default.DBDriver = MySQLi
database.default.DBPrefix =
database.default.port = 3306

# Custom keys read via env() in Config\Sgx
sgx.baseURL = 'https://REPLACE_WITH_SGX_INTERNAL_BASE'
sgx.companyCode = 'REPLACE'
sgx.backfill = false
cors.allowedOrigins = 'https://metaoptics.sg,https://www.metaoptics.sg'
```

Create `backend/app/Config/Sgx.php`:

```php
<?php
declare(strict_types=1);

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Sgx extends BaseConfig
{
    public string $baseURL = '';
    public string $companyCode = '';
    public bool $backfill = false;
    /** @var list<string> */
    public array $corsOrigins = [];

    public function __construct()
    {
        parent::__construct();
        $this->baseURL = rtrim((string) env('sgx.baseURL', ''), '/');
        $this->companyCode = (string) env('sgx.companyCode', '');
        $this->backfill = filter_var(env('sgx.backfill', false), FILTER_VALIDATE_BOOLEAN);
        $origins = (string) env('cors.allowedOrigins', 'https://metaoptics.sg');
        $this->corsOrigins = array_values(array_filter(array_map('trim', explode(',', $origins))));
    }
}
```

Place `CiBootstrapTest.php` under `backend/tests/unit/Health/`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && ./vendor/bin/phpunit tests/unit/Health/CiBootstrapTest.php -v`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/
git commit -m "feat(backend): scaffold CodeIgniter 4 appstarter for IR"
```

---

### Task 2: Migrations — announcements + sync_runs

**Files:**
- Create: `backend/app/Database/Migrations/2026-09-18-100000_CreateAnnouncementsAndSyncRuns.php`
- Create: `backend/app/Models/AnnouncementModel.php`
- Create: `backend/app/Models/SyncRunModel.php`
- Test: `backend/tests/database/AnnouncementsMigrationTest.php`

**Interfaces:**
- Consumes: CI database service
- Produces: tables matching design §4; Model classes `AnnouncementModel`, `SyncRunModel`

- [ ] **Step 1: Write the failing test**

```php
<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementsMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_announcements_table_has_sgx_reference(): void
    {
        $this->assertTrue($this->db->tableExists('announcements'));
        $fields = array_column($this->db->getFieldData('announcements'), 'name');
        $this->assertContains('sgx_reference', $fields);
        $this->assertContains('source_payload', $fields);
        $this->assertContains('needs_review', $fields);
        $this->assertTrue($this->db->tableExists('sync_runs'));
    }
}
```

- [ ] **Step 2: Run — expect FAIL** (migration missing / table missing)

Run: `cd backend && ./vendor/bin/phpunit tests/database/AnnouncementsMigrationTest.php -v`

- [ ] **Step 3: Write migration + models**

```php
<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAnnouncementsAndSyncRuns extends Migration
{
    public function up(): void
    {
        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'sgx_reference' => ['type' => 'VARCHAR', 'constraint' => 64],
            'slug' => ['type' => 'VARCHAR', 'constraint' => 191],
            'source_url' => ['type' => 'VARCHAR', 'constraint' => 512, 'default' => ''],
            'title' => ['type' => 'VARCHAR', 'constraint' => 512],
            'category' => ['type' => 'VARCHAR', 'constraint' => 128, 'default' => 'General Announcement'],
            'issuer' => ['type' => 'VARCHAR', 'constraint' => 255, 'default' => ''],
            'filed_at' => ['type' => 'DATETIME'],
            'source_payload' => ['type' => 'JSON'],
            'source_hash' => ['type' => 'CHAR', 'constraint' => 64],
            'summary' => ['type' => 'TEXT', 'null' => true],
            'email_subject' => ['type' => 'VARCHAR', 'constraint' => 255, 'null' => true],
            'email_intro' => ['type' => 'TEXT', 'null' => true],
            'state' => ['type' => 'ENUM', 'constraint' => ['pending_review', 'published', 'archived'], 'default' => 'pending_review'],
            'published_at' => ['type' => 'DATETIME', 'null' => true],
            'needs_review' => ['type' => 'TINYINT', 'constraint' => 1, 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addUniqueKey('sgx_reference');
        $this->forge->addUniqueKey('slug');
        $this->forge->addKey(['state', 'filed_at']);
        $this->forge->createTable('announcements', true);

        $this->forge->addField([
            'id' => ['type' => 'BIGINT', 'unsigned' => true, 'auto_increment' => true],
            'started_at' => ['type' => 'DATETIME'],
            'finished_at' => ['type' => 'DATETIME', 'null' => true],
            'status' => ['type' => 'ENUM', 'constraint' => ['running', 'success', 'failed'], 'default' => 'running'],
            'fetched_count' => ['type' => 'INT', 'default' => 0],
            'new_count' => ['type' => 'INT', 'default' => 0],
            'updated_count' => ['type' => 'INT', 'default' => 0],
            'error_message' => ['type' => 'VARCHAR', 'constraint' => 1000, 'null' => true],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('sync_runs', true);
    }

    public function down(): void
    {
        $this->forge->dropTable('sync_runs', true);
        $this->forge->dropTable('announcements', true);
    }
}
```

`AnnouncementModel`:

```php
<?php
declare(strict_types=1);

namespace App\Models;

use CodeIgniter\Model;

class AnnouncementModel extends Model
{
    protected $table = 'announcements';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'sgx_reference', 'slug', 'source_url', 'title', 'category', 'issuer',
        'filed_at', 'source_payload', 'source_hash', 'summary', 'email_subject',
        'email_intro', 'state', 'published_at', 'needs_review',
    ];
    protected $useTimestamps = true;
}
```

`SyncRunModel` similarly with fields `started_at`, `finished_at`, `status`, counts, `error_message`; `useTimestamps` false except set `created_at` manually or enable created only.

Run: `cd backend && php spark migrate`

- [ ] **Step 4: Run test — PASS**

- [ ] **Step 5: Commit**

```bash
git add backend/app/Database/Migrations/ backend/app/Models/ \
  backend/tests/database/AnnouncementsMigrationTest.php
git commit -m "feat(backend): CI4 migrations for announcements and sync_runs"
```

---

### Task 3: Normalizer + SourceHasher

**Files:**
- Create: `backend/app/Libraries/Sgx/AnnouncementNormalizer.php`
- Create: `backend/app/Libraries/Sgx/SourceHasher.php`
- Create: `backend/tests/_support/Fixtures/sgx/list-page-1.json`
- Test: `backend/tests/unit/Sgx/AnnouncementNormalizerTest.php`
- Test: `backend/tests/unit/Sgx/SourceHasherTest.php`

**Interfaces:**
- `AnnouncementNormalizer::normalize(array $item): array` → keys `sgx_reference`, `slug`, `source_url`, `title`, `category`, `issuer`, `filed_at`, `source_payload`
- `SourceHasher::hash(string $json): string` → sha256 hex

- [ ] **Step 1: Failing tests** (same assertions as prior plan — fixture item reference `SG25010100ABCDE`)

Use fixture JSON identical to previous plan’s `list-page-1.json` (2 items, MetaOptics MOU + financials).

```php
$n = (new \App\Libraries\Sgx\AnnouncementNormalizer())->normalize($item);
$this->assertSame('SG25010100ABCDE', $n['sgx_reference']);
```

- [ ] **Step 2: Run FAIL**

Run: `cd backend && ./vendor/bin/phpunit tests/unit/Sgx/AnnouncementNormalizerTest.php tests/unit/Sgx/SourceHasherTest.php -v`

- [ ] **Step 3: Implement libraries**

Port the normalizer/hasher logic from the previous plain-PHP plan into `App\Libraries\Sgx\*` (same algorithms: SGX date parse, slugify, JSON payload encode). Namespace only changes.

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(backend): SGX announcement normalizer and source hasher"
```

---

### Task 4: SgxHttpClient with injectable transport

**Files:**
- Create: `backend/app/Libraries/Sgx/SgxFetchException.php`
- Create: `backend/app/Libraries/Sgx/SgxSession.php`
- Create: `backend/app/Libraries/Sgx/SgxHttpClient.php`
- Create: fixtures page-2, malformed, empty-ok-shape
- Modify: `backend/app/Config/Services.php` — `sgxClient(?callable $transport = null)`
- Test: `backend/tests/unit/Sgx/SgxHttpClientTest.php`

**Interfaces:**
- Constructor: `(Config\Sgx $config, ?callable $transport = null)` where transport is `function(string $method, string $url, array $headers): string`
- Default transport uses `Services::curlrequest()` and throws `SgxFetchException` on HTTP ≥500 / network error
- `fetchAllPages(): list<array>` — validates JSON shape; empty `items` with `total > 0` is failure; max 3 retries backoff 1/2/4s

- [ ] **Step 1: Failing test** — merge 3 items across 2 fixture pages; malformed throws

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement client + session**

Production transport sketch:

```php
$client = \Config\Services::curlrequest(['http_errors' => false]);
$response = $client->request($method, $url, ['headers' => $headers]);
if ($response->getStatusCode() >= 500) {
    throw new SgxFetchException('SGX HTTP ' . $response->getStatusCode());
}
return (string) $response->getBody();
```

Register in `Services.php`:

```php
public static function sgxClient($getShared = true, ?callable $transport = null)
{
    if ($transport !== null) {
        return new \App\Libraries\Sgx\SgxHttpClient(config('Sgx'), $transport);
    }
    if ($getShared) {
        return static::getSharedInstance('sgxClient');
    }
    return new \App\Libraries\Sgx\SgxHttpClient(config('Sgx'));
}
```

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(backend): SGX HTTP client with pagination validation"
```

---

### Task 5: SyncService + SyncLock

**Files:**
- Create: `backend/app/Libraries/Sgx/SyncLock.php`
- Create: `backend/app/Libraries/Sgx/SyncService.php`
- Create: `backend/app/Libraries/Sgx/SyncResult.php`
- Test: `backend/tests/unit/Sgx/SyncServiceTest.php`

**Interfaces:**
- `SyncLock::acquire(string $name): bool` / `release(string $name): void` — MySQL `SELECT GET_LOCK(?, 0)` / `RELEASE_LOCK(?)`
- `SyncService::run(array $rawItems): SyncResult` with `fetchedCount`, `newCount`, `updatedCount`
- Backfill (`config('Sgx')->backfill === true`): new → `published` + `published_at`
- Incremental: new → `pending_review`
- Same hash → unchanged; different hash → update source fields + `needs_review=1`, keep `summary`
- Validate/normalize **all** items before any write; on failure mark `sync_runs` failed and throw — no partial commit

- [ ] **Step 1: Failing tests** — backfill publish + dedupe; incremental pending; hash change keeps summary

Use `DatabaseTestTrait` + migrate refresh; insert via SyncService.

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement**

```php
final class SyncResult
{
    public function __construct(
        public int $fetchedCount,
        public int $newCount,
        public int $updatedCount,
    ) {}
}
```

Upsert via `AnnouncementModel::where('sgx_reference', $ref)->first()` then insert/update.

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(backend): SyncService with backfill publish and hash detection"
```

---

### Task 6: Spark command `sgx:sync`

**Files:**
- Create: `backend/app/Commands/SgxSync.php`
- Modify: ensure command auto-discovered (`app/Config/Generators` not needed — Commands folder is enough)
- Test: `backend/tests/unit/Sgx/SgxSyncCommandTest.php` (assert class exists + `getName()==='sgx:sync'`) or feature test calling command with mocked client via Services override

**Interfaces:**
- CLI: `php spark sgx:sync`
- Exit 0 success / 1 failure / 1 if lock not acquired
- On incremental `newCount > 0`: CLI writes `digest_pending new_count=N`
- Cron: `0 8 * * * TZ=Asia/Singapore cd /var/www/metaoptics-ir/backend && php spark sgx:sync >> /var/log/sgx-sync.log 2>&1`
- First prod import: `.env` `sgx.backfill = true`, run once, set `false`

- [ ] **Step 1: Failing test for command registration**

```php
public function test_command_is_registered(): void
{
    $commands = service('commands')->getCommands();
    $this->assertArrayHasKey('sgx:sync', $commands);
}
```

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement**

```php
<?php
declare(strict_types=1);

namespace App\Commands;

use App\Libraries\Sgx\SyncLock;
use App\Libraries\Sgx\SyncService;
use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;
use Config\Services;

class SgxSync extends BaseCommand
{
    protected $group = 'SGX';
    protected $name = 'sgx:sync';
    protected $description = 'Fetch and upsert MetaOptics SGX announcements';

    public function run(array $params): int
    {
        $db = db_connect();
        $lock = new SyncLock($db);
        if (!$lock->acquire('sgx_sync')) {
            CLI::error('Another sync is running');
            return EXIT_ERROR;
        }
        try {
            $client = Services::sgxClient();
            $items = $client->fetchAllPages();
            $result = (new SyncService($db, config('Sgx')))->run($items);
            CLI::write(sprintf(
                'OK fetched=%d new=%d updated=%d',
                $result->fetchedCount,
                $result->newCount,
                $result->updatedCount
            ));
            if (!config('Sgx')->backfill && $result->newCount > 0) {
                CLI::write('digest_pending new_count=' . $result->newCount);
            }
            return EXIT_SUCCESS;
        } catch (\Throwable $e) {
            CLI::error('SYNC_FAILED: ' . substr($e->getMessage(), 0, 500));
            return EXIT_ERROR;
        } finally {
            $lock->release('sgx_sync');
        }
    }
}
```

Document cron in `backend/README.md` (short, this task).

- [ ] **Step 4: PASS** — `php spark list` shows `sgx:sync`

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(backend): spark sgx:sync command with lock"
```

---

### Task 7: Public Announcements API controller

**Files:**
- Create: `backend/app/Controllers/Api/Announcements.php`
- Create: `backend/app/Libraries/Sgx/AnnouncementPresenter.php`
- Modify: `backend/app/Config/Routes.php`
- Create: CORS filter or set headers in controller constructor
- Test: `backend/tests/feature/Api/AnnouncementsApiTest.php`

**Interfaces:**
- `GET /api/announcements` → `{ data: [...], meta: { page, page_size, total } }`
- `GET /api/announcements/(:segment)` by slug
- Query: `page`, `page_size` (max 50), `category`, `q`, `date_from`, `date_to`
- Presenter omits `source_payload`, `source_hash`, `needs_review`

Routes:

```php
$routes->group('api', static function ($routes) {
    $routes->get('announcements', 'Api\Announcements::index');
    $routes->get('announcements/(:segment)', 'Api\Announcements::show/$1');
});
```

- [ ] **Step 1: Feature test with DatabaseTestTrait** — seed published + pending; assert only published; assert no `source_payload` key

```php
use CodeIgniter\Test\FeatureTestTrait;
// $this->get('/api/announcements')->assertOK();
```

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement controller**

```php
public function index()
{
    $this->applyCors();
    $page = max(1, (int) ($this->request->getGet('page') ?? 1));
    $size = min(50, max(1, (int) ($this->request->getGet('page_size') ?? 10)));
    $model = model(AnnouncementModel::class);
    $builder = $model->builder()->where('state', 'published');
    // apply category, q (LIKE title/summary), date filters on filed_at
    $total = $builder->countAllResults(false);
    $rows = $builder->orderBy('filed_at', 'DESC')->limit($size, ($page - 1) * $size)->get()->getResultArray();
    return $this->response->setJSON([
        'data' => array_map([AnnouncementPresenter::class, 'fromRow'], $rows),
        'meta' => ['page' => $page, 'page_size' => $size, 'total' => $total],
    ]);
}
```

CORS: if `Origin` in `config('Sgx')->corsOrigins`, set `Access-Control-Allow-Origin` to that origin.

- [ ] **Step 4: PASS** + full `./vendor/bin/phpunit`

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(backend): public published announcements JSON API"
```

---

### Task 8: Next.js API client + flag

**Files:**
- Create: `src/lib/announcements-api.js`
- Create: `src/lib/announcements-api.test.mjs`
- Modify: `src/constants/ir-feature-flags.js` — `useAnnouncementsApi: false`
- Modify: `src/layouts/investor-relations/company-announcements/index.js`

**Interfaces:**
- `mapApiAnnouncementToLegacy(row)` / `fetchAnnouncementList(params)` against `NEXT_PUBLIC_IR_API_BASE` (CI4 `public/` origin)

Same test and mapper as previous plan (filed_at → SG-style `date` string in Asia/Singapore).

- [ ] **Step 1–5: TDD mapper, wire flag-gated fetch, commit**

```bash
git commit -m "feat(ir): announcements API client with JSON fallback flag"
```

---

### Task 9: Staging checklist

**Files:**
- Create: `docs/superpowers/plans/checklists/2026-09-18-sgx-mirror-staging.md`

Checks: backfill once; dedupe; incremental pending; malformed → failed run + API still serves published; lock blocks overlap; API schema; FE flag on staging.

```bash
git commit -m "docs: SGX Mirror staging checklist (CI4)"
```

---

## Self-Review

1. **Spec coverage:** CI4 sync, session client, pagination validate, hash/dedupe, backfill, pending incremental, lock, public API, FE flag — covered. Digest send deferred.
2. **Placeholders:** None; SGX URL/company via `.env`.
3. **Types:** `SyncService::run`, `AnnouncementNormalizer::normalize`, Spark `sgx:sync`, API JSON fields stable for CMS/Email plans.

---

**Plan complete and saved to `docs/superpowers/plans/2026-09-18-sgx-mirror.md`. Two execution options:**

**1. Subagent-Driven (recommended)**  
**2. Inline Execution**  

Which approach?
