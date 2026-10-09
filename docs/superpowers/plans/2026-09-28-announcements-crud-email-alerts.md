# Announcements CRUD + Email Alerts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split CI4 IR CMS into full Announcements CRUD (manual + SGX upsert) and a standalone Email Alerts module (attach many Published items, schedule/Send now, per-alert dashboard), retiring per-announcement Send.

**Architecture:** New `email_alerts` + `email_alert_announcements` (with send-time snapshots). Dispatch creates one `email_campaigns` row linked by `email_alert_id`, fans out via extended `CampaignFanout` on **union of categories**, reuses `email:work`. Announcements gain `source` (`sgx`|`manual`), nullable `sgx_reference`, optional `body_html`. Admin UI stays PHP + `admin.css`; WYSIWYG via TinyMCE CDN.

**Tech Stack:** CodeIgniter 4.7+, PHP 8.2+, MySQL, PHPUnit (CIUnitTestCase + DatabaseTestTrait + FeatureTestTrait), TinyMCE 7 CDN, existing `MailerInterface` / `email:work`.

## Global Constraints

- Spec: `docs/superpowers/designs/2026-09-28-announcements-crud-email-alerts.md`
- Do **not** flip FE flags (`useAnnouncementsApi`, `showEmailAlerts`).
- Attach only `state=published`; schedule/send requires **≥1** attach; audience = **union of attached categories**.
- Alert delete only in `draft`; block delete while `sending`; Sent content is snapshot-immutable.
- Timezone for schedule UI/storage semantics: **Asia/Singapore**.
- Open/click metrics: display `—` / `n/a` (no ESP instrumentation in MVP).
- Editor: **WYSIWYG** (TinyMCE); merge token `{{announcement}}`.
- Reuse `email_deliveries` + `php spark email:work`; add `php spark email:dispatch-scheduled`.
- Prefer smallest diffs; update tests that assert old Send-on-announcement behavior.
- After code changes: `graphify update .` (AST-only) when feasible.

**Ship phases:** Tasks 1–3 = Announcements CRUD usable alone. Tasks 4–9 = Email Alerts. Do not start Task 4 until Phase A tests are green.

---

## File Structure

```text
backend/
  app/Database/Migrations/
    2026-09-28-100000_AlterAnnouncementsForCrud.php          # NEW
    2026-09-28-110000_CreateEmailAlerts.php                  # NEW
  app/Models/
    AnnouncementModel.php                                    # MODIFY allowedFields
    EmailAlertModel.php                                      # NEW
    EmailAlertAnnouncementModel.php                          # NEW
    EmailCampaignModel.php                                   # MODIFY for email_alert_id
  app/Libraries/Sgx/
    SyncService.php                                          # MODIFY set source=sgx
  app/Libraries/Admin/
    ManualAnnouncementService.php                            # NEW
    AnnouncementDeleteGuard.php                              # NEW
    PublishService.php                                       # unchanged behavior
    SendEmailGate.php                                        # DELETE or leave unused; remove controller use
  app/Libraries/Email/
    CampaignFanout.php                                       # MODIFY categories list
    AlertBodyRenderer.php                                    # NEW
    AudienceResolver.php                                     # NEW
    AlertDispatchService.php                                 # NEW
    AlertLifecycleService.php                                # NEW
  app/Controllers/Admin/
    Announcements.php                                        # MODIFY CRUD; remove send
    EmailAlerts.php                                          # NEW
    Dashboard.php                                            # MODIFY alert counts
  app/Commands/
    EmailDispatchScheduled.php                               # NEW
  app/Config/Routes.php                                      # MODIFY
  app/Views/admin/
    layout.php                                               # MODIFY nav
    dashboard.php                                            # MODIFY
    announcements/index.php                                  # MODIFY filters + New
    announcements/form.php                                   # NEW create/edit manual
    announcements/show.php                                   # MODIFY hide send/email fields
    email_alerts/index.php                                   # NEW
    email_alerts/form.php                                    # NEW compose
    email_alerts/show.php                                    # NEW dashboard
  app/Views/emails/announcement.php                          # MODIFY if needed (body already HTML)
  public/js/admin-alert-editor.js                            # NEW TinyMCE token helper
  tests/database/AnnouncementCrudMigrationTest.php           # NEW
  tests/database/EmailAlertsMigrationTest.php                # NEW
  tests/unit/Admin/ManualAnnouncementServiceTest.php         # NEW
  tests/unit/Admin/AnnouncementDeleteGuardTest.php           # NEW
  tests/unit/Email/AlertBodyRendererTest.php                 # NEW
  tests/unit/Email/AudienceResolverTest.php                  # NEW
  tests/unit/Email/CampaignFanoutTest.php                    # MODIFY
  tests/unit/Email/AlertLifecycleServiceTest.php             # NEW
  tests/unit/Email/AlertDispatchServiceTest.php              # NEW
  tests/feature/Admin/AnnouncementCrudTest.php               # NEW
  tests/feature/Admin/EmailAlertsAdminTest.php               # NEW
  tests/feature/Admin/AdminPublishSendTest.php               # MODIFY remove send assertions
  tests/unit/Admin/SendEmailGateTest.php                     # DELETE or rewrite → dispatch
docs/
  IR_SGX_MIRROR_CMS_EMAIL_CLIENT_SCOPE_EN.md                 # MODIFY scope note (Task 9)
  superpowers/designs/2026-09-28-announcements-crud-email-alerts.md  # reference only
```

---

### Task 1: Migration — announcements CRUD columns

**Files:**
- Create: `backend/app/Database/Migrations/2026-09-28-100000_AlterAnnouncementsForCrud.php`
- Modify: `backend/app/Models/AnnouncementModel.php`
- Create: `backend/tests/database/AnnouncementCrudMigrationTest.php`

**Interfaces:**
- Produces: columns `source ENUM('sgx','manual') NOT NULL DEFAULT 'sgx'`, `body_html TEXT NULL`, `sgx_reference` nullable (UNIQUE retained; multiple NULLs OK on MySQL)

- [ ] **Step 1: Write the failing test**

```php
<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementCrudMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_announcements_have_source_and_nullable_sgx_reference(): void
    {
        $db = db_connect();
        $this->assertTrue($db->fieldExists('source', 'announcements'));
        $this->assertTrue($db->fieldExists('body_html', 'announcements'));

        $db->table('announcements')->insert([
            'sgx_reference' => null,
            'slug' => 'manual-test-slug',
            'source_url' => '',
            'title' => 'Manual item',
            'category' => 'General Announcement',
            'issuer' => '',
            'filed_at' => '2026-09-28 10:00:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('b', 64),
            'source' => 'manual',
            'body_html' => '<p>Hi</p>',
            'state' => 'pending_review',
            'needs_review' => 0,
        ]);

        $row = $db->table('announcements')->where('slug', 'manual-test-slug')->get()->getRowArray();
        $this->assertSame('manual', $row['source']);
        $this->assertNull($row['sgx_reference']);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/database/AnnouncementCrudMigrationTest.php`

Expected: FAIL (`source` field missing or insert rejects null `sgx_reference`).

- [ ] **Step 3: Write migration + model fields**

```php
<?php
declare(strict_types=1);

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AlterAnnouncementsForCrud extends Migration
{
    public function up(): void
    {
        $this->forge->addColumn('announcements', [
            'source' => [
                'type' => 'ENUM',
                'constraint' => ['sgx', 'manual'],
                'default' => 'sgx',
                'null' => false,
                'after' => 'id',
            ],
            'body_html' => [
                'type' => 'TEXT',
                'null' => true,
                'after' => 'summary',
            ],
        ]);

        // Drop UNIQUE, alter nullability, re-add UNIQUE (MySQL).
        $this->db->query('ALTER TABLE announcements MODIFY sgx_reference VARCHAR(64) NULL');
        // Existing unique key name may be `sgx_reference`; if migrate refresh uses forge name:
        try {
            $this->forge->dropKey('announcements', 'sgx_reference');
        } catch (\Throwable) {
            // ignore if named differently in env — re-run describe and drop by actual name
        }
        $this->forge->addUniqueKey('sgx_reference');
        // If forge addUniqueKey on existing table is awkward, use raw:
        // $this->db->query('ALTER TABLE announcements ADD UNIQUE KEY sgx_reference (sgx_reference)');
    }

    public function down(): void
    {
        $this->forge->dropColumn('announcements', ['source', 'body_html']);
        $this->db->query('ALTER TABLE announcements MODIFY sgx_reference VARCHAR(64) NOT NULL');
    }
}
```

Update `AnnouncementModel::$allowedFields` to include `source`, `body_html`.

**Note for implementer:** On SQLite test DB, ENUM becomes VARCHAR; nullable unique works. Prefer `DatabaseTestTrait` refresh so migration runs. If `dropKey` name differs, inspect `$this->db->getIndexData('announcements')` in a one-off and hardcode the real index name in the migration.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/database/AnnouncementCrudMigrationTest.php`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/Database/Migrations/2026-09-28-100000_AlterAnnouncementsForCrud.php \
  backend/app/Models/AnnouncementModel.php \
  backend/tests/database/AnnouncementCrudMigrationTest.php
git commit -m "$(cat <<'EOF'
feat(backend): allow manual announcements with source and nullable SGX ref

EOF
)"
```

---

### Task 2: Sync marks `source=sgx` + ManualAnnouncementService

**Files:**
- Modify: `backend/app/Libraries/Sgx/SyncService.php` (insert path only)
- Create: `backend/app/Libraries/Admin/ManualAnnouncementService.php`
- Create: `backend/tests/unit/Admin/ManualAnnouncementServiceTest.php`
- Modify: `backend/tests/unit/Sgx/SyncServiceTest.php` — assert `source=sgx` on inserted row

**Interfaces:**
- Consumes: `AnnouncementModel`, slug rules similar to `AnnouncementNormalizer::slugify` (copy private logic or extract — **ponytail:** duplicate small slugify in Manual service to avoid big refactor)
- Produces:
  - `ManualAnnouncementService::create(array $input): int`  
    Input keys: `title`, `category`, `filed_at` (Y-m-d H:i:s SGT wall), `source_url?`, `summary?`, `body_html?`, `state?` (`pending_review`|`published`)
  - Sets `source=manual`, `sgx_reference=null`, `source_payload={"manual":true}`, `source_hash=hash(payload)`, unique `slug`

- [ ] **Step 1: Write the failing tests**

```php
<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\ManualAnnouncementService;
use App\Models\AnnouncementModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use InvalidArgumentException;

final class ManualAnnouncementServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_create_manual_pending_with_null_sgx_reference(): void
    {
        $id = (new ManualAnnouncementService())->create([
            'title' => 'Board Update',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
            'summary' => 'Short',
        ]);

        $row = model(AnnouncementModel::class)->find($id);
        $this->assertSame('manual', $row['source']);
        $this->assertNull($row['sgx_reference']);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNotSame('', $row['slug']);
    }

    public function test_create_rejects_empty_title(): void
    {
        $this->expectException(InvalidArgumentException::class);
        (new ManualAnnouncementService())->create([
            'title' => '  ',
            'category' => 'General Announcement',
            'filed_at' => '2026-09-28 09:00:00',
        ]);
    }
}
```

In `SyncServiceTest::test_backfill_publishes_new_and_dedupes_on_second_run`, after first run assert `$rows[0]['source'] === 'sgx'`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/ManualAnnouncementServiceTest.php`

Expected: FAIL (class missing).

- [ ] **Step 3: Implement service + SyncService insert field**

```php
<?php
declare(strict_types=1);

namespace App\Libraries\Admin;

use App\Models\AnnouncementModel;
use InvalidArgumentException;

final class ManualAnnouncementService
{
    public function __construct(private readonly AnnouncementModel $model = new AnnouncementModel())
    {
    }

    /** @param array<string, mixed> $input */
    public function create(array $input): int
    {
        $title = trim((string) ($input['title'] ?? ''));
        if ($title === '') {
            throw new InvalidArgumentException('title required');
        }
        $category = trim((string) ($input['category'] ?? 'General Announcement')) ?: 'General Announcement';
        $filedAt = (string) ($input['filed_at'] ?? '');
        if ($filedAt === '') {
            throw new InvalidArgumentException('filed_at required');
        }
        $state = (string) ($input['state'] ?? 'pending_review');
        if (! in_array($state, ['pending_review', 'published'], true)) {
            throw new InvalidArgumentException('invalid state');
        }

        $payload = json_encode(['manual' => true], JSON_THROW_ON_ERROR);
        $slugBase = $this->slugify($category . '-' . $title . '-manual');
        $slug = $slugBase;
        $i = 1;
        while ($this->model->where('slug', $slug)->first() !== null) {
            $slug = substr($slugBase, 0, 180) . '-' . $i++;
        }

        $now = date('Y-m-d H:i:s');
        $id = $this->model->insert([
            'source' => 'manual',
            'sgx_reference' => null,
            'slug' => $slug,
            'source_url' => (string) ($input['source_url'] ?? ''),
            'title' => $title,
            'category' => $category,
            'issuer' => (string) ($input['issuer'] ?? ''),
            'filed_at' => $filedAt,
            'source_payload' => $payload,
            'source_hash' => hash('sha256', $payload),
            'summary' => $input['summary'] ?? null,
            'body_html' => $input['body_html'] ?? null,
            'state' => $state,
            'published_at' => $state === 'published' ? $now : null,
            'needs_review' => 0,
        ], true);

        return (int) $id;
    }

    private function slugify(string $value): string
    {
        $value = strtolower($value);
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
        $value = trim($value, '-') ?: 'announcement';

        return substr($value, 0, 191);
    }
}
```

In `SyncService::upsertAll` insert array, add `'source' => 'sgx'`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/ManualAnnouncementServiceTest.php tests/unit/Sgx/SyncServiceTest.php`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Admin/ManualAnnouncementService.php \
  backend/app/Libraries/Sgx/SyncService.php \
  backend/tests/unit/Admin/ManualAnnouncementServiceTest.php \
  backend/tests/unit/Sgx/SyncServiceTest.php
git commit -m "$(cat <<'EOF'
feat(backend): manual announcement create and tag SGX sync source

EOF
)"
```

---

### Task 3: Admin Announcements CRUD UI + remove Send

**Files:**
- Modify: `backend/app/Config/Routes.php`
- Modify: `backend/app/Controllers/Admin/Announcements.php`
- Create: `backend/app/Libraries/Admin/AnnouncementDeleteGuard.php`
- Modify: `backend/app/Views/admin/announcements/index.php`
- Create: `backend/app/Views/admin/announcements/form.php`
- Modify: `backend/app/Views/admin/announcements/show.php` — remove Send form + email_subject/email_intro fields; show source badge; Delete button; link to create alert (href only, alert module may 404 until Task 8 — use `#` or hide link until Task 8; **prefer:** add link in Task 8)
- Modify: `backend/tests/feature/Admin/AdminPublishSendTest.php` — drop send CSRF/route assertions
- Create: `backend/tests/feature/Admin/AnnouncementCrudTest.php`
- Create: `backend/tests/unit/Admin/AnnouncementDeleteGuardTest.php`

**Interfaces:**
- Routes (under `adminAuth`):
  - `GET announcements/new` → `createForm`
  - `POST announcements` → `create`
  - `POST announcements/(:num)/delete` → `delete`
  - Keep summary/publish/archive; **remove** `announcements/(:num)/send`
- `AnnouncementDeleteGuard::assertCanDelete(int $id): void` — for Phase A (no email_alerts yet) always allow; Phase B extend to throw `DomainException('locked_sending')` if attached to alert status `sending`. Implement stub in Task 3; tighten in Task 7.

- [ ] **Step 1: Write failing feature test**

```php
<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Services;

final class AnnouncementCrudTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    protected function setUp(): void
    {
        parent::setUp();
        // Match existing Admin feature tests: seed session admin if project uses session login
        // Copy pattern from AdminPublishSendTest.php (read that file and reuse helper).
    }

    public function test_create_manual_announcement_via_post(): void
    {
        $this->withSession(['admin_logged_in' => true]) // adjust key to match AuthController
            ->post('admin/announcements', [
                'csrf_test_name' => csrf_hash(), // adjust CSRF field name used in app
                'title' => 'Manual IR Note',
                'category' => 'General Announcement',
                'filed_at' => '2026-09-28 11:00:00',
                'summary' => 'Summary',
            ])
            ->assertRedirect();

        $this->assertNotNull(model('AnnouncementModel')->where('title', 'Manual IR Note')->first());
    }

    public function test_send_route_gone(): void
    {
        $this->withSession(['admin_logged_in' => true])
            ->post('admin/announcements/1/send', [])
            ->assertStatus(404);
    }
}
```

**Implementer:** Open `tests/feature/Admin/AdminPublishSendTest.php` and copy the exact session + CSRF helpers; do not invent session keys.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/AnnouncementCrudTest.php`

Expected: FAIL (404 on create route or send still 302).

- [ ] **Step 3: Implement controller methods, routes, views, guard stub**

`AnnouncementDeleteGuard` Task 3:

```php
final class AnnouncementDeleteGuard
{
    public function assertCanDelete(int $announcementId): void
    {
        // Phase A: no email_alerts table usage yet.
    }
}
```

Controller `create`: validate → `ManualAnnouncementService::create` → redirect to show.  
Controller `delete`: guard → `$model->delete($id)` → redirect list.  
For SGX rows on edit form: only `summary` editable (existing `updateSummary`).  
Index: filter `?state=` GET; badge for `source`; button “New announcement”.

Remove send from `show.php` and routes. Update `AdminPublishSendTest` accordingly (if it expected 5 CSRF forms, recount).

- [ ] **Step 4: Run tests**

Run: `cd backend && ./vendor/bin/phpunit --no-coverage tests/feature/Admin/AnnouncementCrudTest.php tests/feature/Admin/AdminPublishSendTest.php tests/unit/Admin/AnnouncementDeleteGuardTest.php`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(cms): announcements CRUD and remove per-item Send

EOF
)"
```

---

### Task 4: Migration — email_alerts + alter email_campaigns

**Files:**
- Create: `backend/app/Database/Migrations/2026-09-28-110000_CreateEmailAlerts.php`
- Create: `backend/app/Models/EmailAlertModel.php`
- Create: `backend/app/Models/EmailAlertAnnouncementModel.php`
- Modify: `backend/app/Models/EmailCampaignModel.php`
- Create: `backend/tests/database/EmailAlertsMigrationTest.php`

**Interfaces / schema:**

`email_alerts`:
- `id`, `name` VARCHAR(255) NULL, `subject` VARCHAR(255) NOT NULL, `intro` TEXT NULL, `body_html` MEDIUMTEXT NOT NULL DEFAULT '',
- `status` ENUM(`draft`,`scheduled`,`sending`,`sent`) NOT NULL DEFAULT `draft`,
- `scheduled_at` DATETIME NULL, `sent_at` DATETIME NULL,
- `audience_categories_json` JSON NULL (frozen at dispatch),
- `campaign_id` BIGINT UNSIGNED NULL (set when dispatch starts),
- `created_at`, `updated_at`

`email_alert_announcements`:
- `id`, `email_alert_id`, `announcement_id`, `sort_order` INT DEFAULT 0,
- snapshot nullable until dispatch: `snap_title`, `snap_category`, `snap_filed_at`, `snap_url`, `snap_sgx_reference`
- UNIQUE(`email_alert_id`,`announcement_id`), FK alert CASCADE, FK announcement RESTRICT

`email_campaigns` alter:
- Add `email_alert_id` BIGINT UNSIGNED NULL UNIQUE FK → email_alerts
- Modify `announcement_id` to NULL
- Drop UNIQUE on `announcement_id` (legacy one-campaign-per-announcement)

- [ ] **Step 1: Failing migration test** — insert alert + junction + campaign with `email_alert_id` and null `announcement_id`

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement migration + models (`$allowedFields`, timestamps)**

- [ ] **Step 4: PASS**

- [ ] **Step 5: Commit** `feat(backend): email_alerts schema and campaign alert link`

---

### Task 5: AlertBodyRenderer + AudienceResolver

**Files:**
- Create: `backend/app/Libraries/Email/AlertBodyRenderer.php`
- Create: `backend/app/Libraries/Email/AudienceResolver.php`
- Create: `backend/tests/unit/Email/AlertBodyRendererTest.php`
- Create: `backend/tests/unit/Email/AudienceResolverTest.php`

**Interfaces:**

```php
final class AlertBodyRenderer
{
    /**
     * @param list<array{title: string, filed_at: string, url: string}> $items
     */
    public function render(string $bodyHtml, string $intro, array $items): string
    {
        $listHtml = $this->listHtml($items);
        $token = '{{announcement}}';
        if (str_contains($bodyHtml, $token)) {
            $bodyHtml = str_replace($token, $listHtml, $bodyHtml);
        } else {
            $bodyHtml .= $listHtml;
        }
        $introBlock = $intro !== '' ? '<p>' . esc($intro) . '</p>' : '';

        return $introBlock . $bodyHtml;
    }
}

final class AudienceResolver
{
    /** @param list<array<string, mixed>> $announcementRows */
    public function categoryUnion(array $announcementRows): array
    {
        $cats = [];
        foreach ($announcementRows as $row) {
            $c = trim((string) ($row['category'] ?? ''));
            if ($c !== '') {
                $cats[$c] = true;
            }
        }

        return array_keys($cats);
    }

    /** @param list<string> $categories */
    public function estimateSubscriberCount(array $categories): int
    {
        if ($categories === []) {
            return 0;
        }
        // DISTINCT active subscribers matching ANY category
        $db = db_connect();
        // query builder join subscriber_categories where category_key IN (...) and status=active
        return /* int */;
    }
}
```

- [ ] **Step 1–4: TDD** — token replaced twice if present twice; missing token appends once; union unique; estimate 0 when no cats

- [ ] **Step 5: Commit** `feat(backend): alert body token render and audience union`

---

### Task 6: CampaignFanout multi-category + AlertDispatchService

**Files:**
- Modify: `backend/app/Libraries/Email/CampaignFanout.php`
- Modify: `backend/tests/unit/Email/CampaignFanoutTest.php`
- Create: `backend/app/Libraries/Email/AlertDispatchService.php`
- Create: `backend/tests/unit/Email/AlertDispatchServiceTest.php`
- Delete or gut: `backend/app/Libraries/Admin/SendEmailGate.php` + `tests/unit/Admin/SendEmailGateTest.php` (replace coverage with dispatch tests)

**Interfaces:**

```php
// CampaignFanout
/** @param list<string> $categories */
public function fanout(PDO|BaseConnection $db, int $campaignId, array $categories): int
```

SQL: `WHERE s.status='active' AND sc.category_key IN (...)` with DISTINCT subscriber ids (avoid dup deliveries if subscriber has two matching cats — UNIQUE(campaign_id,subscriber_id) already protects).

Keep backward compat in tests: change call sites from string to `[$category]`.

```php
final class AlertDispatchService
{
    /**
     * Moves draft|scheduled → sending → creates campaign, snapshots attaches,
     * freezes audience_categories_json, fans out, sets sent when fanout done
     * (status `sent` on alert when campaign queued; worker sends deliveries).
     *
     * @throws DomainException not_draft_or_scheduled|no_announcements|empty_audience
     */
    public function dispatch(int $alertId): int // returns campaign_id
}
```

Dispatch steps (transaction):
1. Load alert; status must be `draft` or `scheduled`
2. Load attaches join announcements; each must be `published`; count ≥ 1
3. Snapshot fields onto junction rows
4. `audience = AudienceResolver::categoryUnion`; if empty throw
5. `body = AlertBodyRenderer::render(...)`
6. status=`sending`; insert campaign (`email_alert_id`, subject, body_html, status=`queued`, announcement_id=null)
7. `fanout($db, $campaignId, $audience)`
8. alert `campaign_id`, `audience_categories_json`, `status=sent`, `sent_at=now`  
   (ponytail: skip lingering `sending` if fanout is sync; if you need UI “Sending”, set sending before fanout and sent after)

- [ ] **Step 1–4: TDD** fanout two categories → two subscribers without dup; dispatch happy path; reject unpublished attach

- [ ] **Step 5: Commit** `feat(backend): dispatch email alerts to multi-category campaigns`

---

### Task 7: AlertLifecycleService + schedule worker + delete guards

**Files:**
- Create: `backend/app/Libraries/Email/AlertLifecycleService.php`
- Create: `backend/app/Commands/EmailDispatchScheduled.php`
- Modify: `backend/app/Libraries/Admin/AnnouncementDeleteGuard.php`
- Modify: `backend/README.md` — cron line for `email:dispatch-scheduled`
- Create: `backend/tests/unit/Email/AlertLifecycleServiceTest.php`

**Interfaces:**

```php
final class AlertLifecycleService
{
    public function saveDraft(array $data, array $announcementIds): int;
    public function updateDraft(int $id, array $data, array $announcementIds): void;
    public function schedule(int $id, string $scheduledAtSgt): void; // status=scheduled
    public function cancelSchedule(int $id): void; // → draft, clear scheduled_at
    public function sendNow(int $id): int; // → AlertDispatchService::dispatch
    public function deleteDraft(int $id): void; // only draft
    /** @return list<array> due rows scheduled_at <= now SGT */
    public function dueScheduled(?\DateTimeImmutable $nowSgt = null): array;
}
```

Validation on schedule/sendNow: ≥1 announcement ids all published; subject non-empty; `scheduled_at` > now for schedule.

`AnnouncementDeleteGuard`: if junction exists to alert with `status='sending'` → `DomainException('locked_sending')`. Draft/scheduled/sent attachments do not block announcement delete (Sent keeps snapshot on junction).

Command:

```php
// php spark email:dispatch-scheduled
foreach ($life->dueScheduled() as $row) {
    try {
        $dispatch->dispatch((int) $row['id']);
    } catch (\Throwable $e) {
        log_message('error', 'scheduled alert {id} failed: '.$e->getMessage());
    }
}
```

README cron (after email:work):

```
* * * * * TZ=Asia/Singapore cd /var/www/metaoptics-ir/backend && php spark email:dispatch-scheduled >> /var/log/email-dispatch.log 2>&1
```

- [ ] **Step 1–4: TDD** schedule future; due picks only past; deleteDraft rejects sent; sendNow dispatches

- [ ] **Step 5: Commit** `feat(backend): email alert lifecycle and scheduled dispatch command`

---

### Task 8: Admin Email Alerts UI + nav + dashboard

**Files:**
- Create: `backend/app/Controllers/Admin/EmailAlerts.php`
- Create: views under `backend/app/Views/admin/email_alerts/`
- Create: `backend/public/js/admin-alert-editor.js`
- Modify: `backend/app/Views/admin/layout.php` — nav link Email Alerts
- Modify: `backend/app/Controllers/Admin/Dashboard.php` + `dashboard.php`
- Modify: `backend/app/Config/Routes.php`
- Modify: `backend/app/Views/admin/announcements/show.php` — “Create Email Alert with this” → `admin/email-alerts/new?announcement_id=`
- Create: `backend/tests/feature/Admin/EmailAlertsAdminTest.php`

**Routes:**

```php
$routes->get('email-alerts', 'Admin\EmailAlerts::index');
$routes->get('email-alerts/new', 'Admin\EmailAlerts::createForm');
$routes->post('email-alerts', 'Admin\EmailAlerts::create');
$routes->get('email-alerts/(:num)', 'Admin\EmailAlerts::show/$1');
$routes->get('email-alerts/(:num)/edit', 'Admin\EmailAlerts::editForm/$1');
$routes->post('email-alerts/(:num)', 'Admin\EmailAlerts::update/$1');
$routes->post('email-alerts/(:num)/schedule', 'Admin\EmailAlerts::schedule/$1');
$routes->post('email-alerts/(:num)/send-now', 'Admin\EmailAlerts::sendNow/$1');
$routes->post('email-alerts/(:num)/cancel', 'Admin\EmailAlerts::cancel/$1');
$routes->post('email-alerts/(:num)/delete', 'Admin\EmailAlerts::delete/$1');
```

**WYSIWYG:** In `form.php`:

```html
<script src="https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js" referrerpolicy="origin"></script>
<script src="<?= base_url('js/admin-alert-editor.js') ?>"></script>
<textarea id="body_html" name="body_html">...</textarea>
```

`admin-alert-editor.js`: init TinyMCE on `#body_html`; toolbar button inserts `{{announcement}}`.

**Show dashboard:** metrics from `email_deliveries` grouped by status for `campaign_id`; open/click display literal `—`. Confirm modal on Send now via `onclick="return confirm('Send now to approx N subscribers?')"`.

- [ ] **Step 1: Feature test** — authed GET list 200 contains “Email Alerts”; POST create draft redirects; show page has subject

- [ ] **Step 2: FAIL**

- [ ] **Step 3: Implement UI**

- [ ] **Step 4: PASS** + manual smoke: create draft, attach published, send now with `MAIL_DRIVER=log`

- [ ] **Step 5: Commit** `feat(cms): email alerts admin UI with schedule and dashboard`

---

### Task 9: Docs + regression sweep

**Files:**
- Modify: `docs/IR_SGX_MIRROR_CMS_EMAIL_CLIENT_SCOPE_EN.md` — short section: Email Alert entity, many announcements, schedule; deprecate “Send on announcement detail”
- Modify: `backend/README.md` if any remaining Send docs
- Run full PHPUnit Admin + Email + Sgx filters

- [ ] **Step 1: Update client scope paragraphs** (Feature B actions + Feature C admin send flow) to match design — no ambiguous dual Send entry points

- [ ] **Step 2: Run**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Admin tests/unit/Email tests/unit/Sgx \
  tests/feature/Admin tests/database/AnnouncementCrudMigrationTest.php \
  tests/database/EmailAlertsMigrationTest.php
```

Expected: PASS (fix any stragglers referencing SendEmailGate / send route)

- [ ] **Step 3: `graphify update .`** (optional if sandbox allows)

- [ ] **Step 4: Commit** `docs: align IR scope with decoupled email alerts`

---

## Self-review

**1. Spec coverage**

| Spec item | Task |
|-----------|------|
| Announcements CRUD + manual create | 1–3 |
| SGX sync upsert into list (`source=sgx`) | 2 |
| Email Alert entity 0…N Published attaches | 4–6 |
| Schedule + Send now | 7–8 |
| Report queued/sent/failed + open/click n/a | 8 |
| Small per-alert dashboard | 8 |
| Audience union categories | 5–6 |
| WYSIWYG + `{{announcement}}` | 5, 8 |
| Delete draft only; block sending | 7 |
| Sent snapshot | 6 |
| Remove announcement Send | 3, 9 |
| No FE flag flips | Global constraints |
| Cron dispatch | 7 README |

**2. Placeholder scan:** None intentional; Task 3 explicitly says copy session/CSRF from `AdminPublishSendTest` rather than inventing keys.

**3. Type consistency:** `CampaignFanout::fanout(..., array $categories)`; `AlertDispatchService::dispatch(int): int` campaign id; alert statuses `draft|scheduled|sending|sent`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-28-announcements-crud-email-alerts.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  

**2. Inline Execution** — execute tasks in this session with executing-plans checkpoints  

Which approach?
