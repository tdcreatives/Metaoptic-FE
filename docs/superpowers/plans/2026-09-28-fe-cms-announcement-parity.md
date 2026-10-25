# FE ↔ CMS Announcement Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CMS/DB + public API emit the live FE announcement contract (`announcements.json` shape), seed DB from that JSON as Published, keep SGX sync writing the same schema, and on Publish optionally create a prefilled Email Alert draft — without flipping FE launch flags.

**Architecture:** Expand `announcements` + child tables to hold FE detail fields; `JsonAnnouncementImporter` one-shot seeds Published rows (keep slug); `AnnouncementPresenter::fromRow` rebuilds legacy nested JSON (layout fields derive when overrides NULL); API `show` already exists by slug — FE wires it when flag on; Publish success → modal → `AlertDraftFromAnnouncementService` → `AlertLifecycleService::saveDraft` with attach/subject/intro/`{{announcement}}`.

**Tech Stack:** CodeIgniter 4.7+, PHP 8.2+, MySQL/SQLite tests, PHPUnit (CIUnitTestCase + DatabaseTestTrait + FeatureTestTrait), Next.js FE (`src/lib/announcements-api.js`), existing Email Alerts module.

## Global Constraints

- Spec: `docs/superpowers/designs/2026-09-28-fe-cms-announcement-parity.md`
- Do **not** flip FE flags (`useAnnouncementsApi`, `showEmailAlerts`) in any task of this plan.
- Public API remains **published-only** (`state=published`).
- Import → `state=published`; **no** Email Alert prompts on import.
- Layout overrides `title_btn` / `title_btn_sm` / `title_banner`: NULL ⇒ Presenter derives; non-NULL ⇒ use stored.
- `details.announcement.reference` in API = SGX reference (`ann_reference` / `sgx_reference`), **never** slug.
- SGX list API often lacks full nested detail: sync **must not wipe** existing detail/child rows on hash update when the incoming payload has no nested `details`. Prefer merge: update core list fields; only replace detail/children when nested details are present in payload.
- Email Alert draft after Publish is **best-effort**: failure flashes error; announcement stays Published.
- Audience for alerts = union of attached announcement `category` values (existing `AudienceResolver`); soft-fail empty estimate is OK.
- Prefer smallest diffs; reuse `AlertLifecycleService::saveDraft`.
- After code changes: `graphify update .` (AST-only) when feasible.

**Ship phases:** Tasks 1–4 = schema + Presenter + import (FE can diff API vs JSON on staging). Tasks 5–6 = sync merge + admin layout/publish→draft. Task 7 = FE mapper/detail. Task 8 = docs + regression. Do not start Task 7 until Presenter contract tests are green.

---

## File Structure

```text
backend/
  app/Database/Migrations/
    2026-09-28-200000_ExpandAnnouncementsForFeParity.php     # NEW
  app/Models/
    AnnouncementModel.php                                    # MODIFY allowedFields
    AnnouncementAttachmentModel.php                          # NEW
    AnnouncementRelatedModel.php                             # NEW
    AnnouncementLabeledRowModel.php                          # NEW (events + additional arrays)
  app/Libraries/Sgx/
    AnnouncementPresenter.php                                # MODIFY legacy FE shape
    AnnouncementNormalizer.php                               # MODIFY map nested when present
    SyncService.php                                          # MODIFY upsert detail merge + children
    LayoutTitleDeriver.php                                   # NEW (pure derive helpers)
  app/Libraries/Admin/
    AnnouncementDetailWriter.php                             # NEW replace children + scalar detail cols
    JsonAnnouncementImporter.php                             # NEW
    AlertDraftFromAnnouncementService.php                    # NEW
    PublishService.php                                       # unchanged publish rules
  app/Commands/
    AnnouncementsImportJson.php                              # NEW spark announcements:import-json
  app/Controllers/Admin/
    Announcements.php                                        # MODIFY layout save + publish offer + create-alert-draft
    EmailAlerts.php                                          # MODIFY createForm prefill subject/intro/body
  app/Controllers/Api/
    Announcements.php                                        # MODIFY hydrate before Presenter
  app/Views/admin/announcements/
    show.php                                                 # MODIFY layout fields + offer_alert modal
  tests/database/
    AnnouncementFeParityMigrationTest.php                    # NEW
  tests/unit/Sgx/
    AnnouncementPresenterLegacyTest.php                      # NEW
    LayoutTitleDeriverTest.php                               # NEW
    SyncServiceTest.php                                      # MODIFY merge/slug cases
    AnnouncementNormalizerTest.php                           # MODIFY
  tests/unit/Admin/
    AnnouncementDetailWriterTest.php                         # NEW
    JsonAnnouncementImporterTest.php                         # NEW
    AlertDraftFromAnnouncementServiceTest.php                # NEW
  tests/feature/Admin/
    AnnouncementPublishAlertOfferTest.php                    # NEW
  tests/_support/Fixtures/announcements/
    fe-parity-one.json                                       # NEW (1 item from live slug sample)
src/
  lib/announcements-api.js                                   # MODIFY mapper + fetchBySlug
  lib/announcements-api.test.mjs                             # MODIFY
  app/investor-relations/company-announcement/[slug]/page.js # MODIFY flag path
  app/company-announcement/[slug]/page.js                    # MODIFY if duplicate route
docs/
  IR_SGX_MIRROR_CMS_EMAIL_CLIENT_SCOPE_EN.md                 # MODIFY short parity note
backend/README.md                                            # MODIFY import command
```

---

### Task 1: Migration — FE parity columns + child tables

**Files:**
- Create: `backend/app/Database/Migrations/2026-09-28-200000_ExpandAnnouncementsForFeParity.php`
- Modify: `backend/app/Models/AnnouncementModel.php` (allowedFields)
- Create: `backend/app/Models/AnnouncementAttachmentModel.php`
- Create: `backend/app/Models/AnnouncementRelatedModel.php`
- Create: `backend/app/Models/AnnouncementLabeledRowModel.php`
- Test: `backend/tests/database/AnnouncementFeParityMigrationTest.php`

**Interfaces:**
- Consumes: existing `announcements` table from prior migrations
- Produces: columns listed below; tables `announcement_attachments`, `announcement_related`, `announcement_labeled_rows` with FK `announcement_id` → `announcements.id` ON DELETE CASCADE

**Column list on `announcements` (all nullable TEXT/VARCHAR unless noted):**

Layout overrides: `title_btn`, `title_btn_sm`, `title_banner` (TEXT NULL)  
Detail: `issuer_name`, `securities_name`, `stapled_security_name` (VARCHAR 255)  
Announcement block: `ann_title`, `ann_subtitle`, `ann_datetime` (VARCHAR 64), `ann_status` (VARCHAR 64), `ann_reference` (VARCHAR 64), `ann_submitted_by`, `ann_designation` (VARCHAR 255), `ann_description` (TEXT), `ann_disclaimer` (TEXT), `ann_effective_start_date`, `ann_report_type`, `ann_final_year_end` (VARCHAR 64)  
Additional scalars FE reads: `addl_description` (TEXT), `addl_name`, `addl_age`, `addl_date_cessation_known`, `addl_date_of_appointment`, `addl_date_cessation`, `addl_country_of_principal_residence` (VARCHAR 255)

**`announcement_labeled_rows`:** `id`, `announcement_id`, `section` VARCHAR (`additional_left`|`additional_right`|`additional_row`|`other_directorship`|`event_narrative`|`event_date_left`|`event_date_right`|`event_venue`), `name` TEXT, `text` TEXT, `sort_order` INT — covers JSON `additional.left/right/rowItems/otherDirectorships` + event blocks without unbounded columns.

- [ ] **Step 1: Write the failing migration test**

```php
<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AnnouncementFeParityMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_fe_parity_columns_and_child_tables_exist(): void
    {
        $db = db_connect();
        foreach (['title_btn', 'ann_reference', 'addl_description', 'issuer_name'] as $col) {
            $this->assertTrue($db->fieldExists($col, 'announcements'), $col);
        }
        $this->assertTrue($db->tableExists('announcement_attachments'));
        $this->assertTrue($db->tableExists('announcement_related'));
        $this->assertTrue($db->tableExists('announcement_labeled_rows'));

        $db->table('announcements')->insert([
            'sgx_reference' => 'SG260911OTHR4TNS',
            'slug' => 'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly',
            'source_url' => '',
            'title' => 'Press Release',
            'category' => 'General Announcement',
            'issuer' => 'METAOPTICS LTD',
            'filed_at' => '2026-09-11 20:43:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('a', 64),
            'source' => 'sgx',
            'state' => 'published',
            'needs_review' => 0,
            'ann_reference' => 'SG260911OTHR4TNS',
            'title_banner' => 'GENERAL<br/>ANNOUNCEMENT',
        ]);
        $id = (int) $db->insertID();
        $db->table('announcement_attachments')->insert([
            'announcement_id' => $id,
            'name' => 'Press.pdf',
            'url' => 'https://links.sgx.com/x',
            'sort_order' => 0,
        ]);
        $row = $db->table('announcements')->where('id', $id)->get()->getRowArray();
        $this->assertSame('SG260911OTHR4TNS', $row['ann_reference']);
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage tests/database/AnnouncementFeParityMigrationTest.php
```

Expected: FAIL (missing columns/tables)

- [ ] **Step 3: Write migration + models**

Implement `up()` with `forge->addColumn` for each field and `createTable` for the three child tables (BIGINT PK, FK CASCADE). `down()` drops child tables then columns. Update `AnnouncementModel::$allowedFields` to include every new scalar. Child models: `$allowedFields` = their columns; `$useTimestamps = false`.

- [ ] **Step 4: Run test to verify it passes**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage tests/database/AnnouncementFeParityMigrationTest.php
```

Expected: OK

- [ ] **Step 5: Commit**

```bash
git add backend/app/Database/Migrations/2026-09-28-200000_ExpandAnnouncementsForFeParity.php \
  backend/app/Models/AnnouncementModel.php \
  backend/app/Models/AnnouncementAttachmentModel.php \
  backend/app/Models/AnnouncementRelatedModel.php \
  backend/app/Models/AnnouncementLabeledRowModel.php \
  backend/tests/database/AnnouncementFeParityMigrationTest.php
git commit -m "$(cat <<'EOF'
feat(backend): expand announcements schema for FE parity fields

EOF
)"
```

---

### Task 2: Layout deriver + Presenter legacy shape

**Files:**
- Create: `backend/app/Libraries/Sgx/LayoutTitleDeriver.php`
- Modify: `backend/app/Libraries/Sgx/AnnouncementPresenter.php`
- Create: `backend/tests/unit/Sgx/LayoutTitleDeriverTest.php`
- Create: `backend/tests/unit/Sgx/AnnouncementPresenterLegacyTest.php`

**Interfaces:**
- Consumes: announcement row enriched with `_attachments`, `_related`, `_labeled_rows` (arrays)
- Produces:
  - `LayoutTitleDeriver::bannerFromCategory(string $category): string` — e.g. `General Announcement` → `GENERAL<br/>ANNOUNCEMENT`
  - `LayoutTitleDeriver::btnFromTitle(string $title): string` — default = title (no forced breaks)
  - `AnnouncementPresenter::fromRow(array $row): array` — **legacy FE shape** keys: `id`, `title`, `title_btn`, `title_btn_sm`, `title_banner`, `slug`, `desc`, `date`, `details`, `category`

**Date format for `date`:** match FE `formatFiledAt` in `src/lib/announcements-api.js` (Asia/Singapore display).

- [ ] **Step 1: Write failing deriver + presenter tests**

```php
public function test_banner_derives_from_category(): void
{
    $this->assertSame(
        'GENERAL<br/>ANNOUNCEMENT',
        LayoutTitleDeriver::bannerFromCategory('General Announcement')
    );
}

public function test_presenter_builds_nested_details_and_uses_ann_reference_not_slug(): void
{
    $out = AnnouncementPresenter::fromRow([
        'id' => 67,
        'slug' => 'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly',
        'title' => 'GENERAL ANNOUNCEMENT::PRESS RELEASE-MOT…',
        'category' => 'General Announcement',
        'summary' => '',
        'filed_at' => '2026-09-11 20:43:00',
        'title_btn' => null,
        'title_btn_sm' => null,
        'title_banner' => null,
        'issuer_name' => 'METAOPTICS LTD',
        'securities_name' => 'METAOPTICS LTD - KYG93Y1D1074 - 9MT',
        'stapled_security_name' => 'No',
        'ann_title' => 'General Announcement',
        'ann_subtitle' => 'Press Release-MOT announces S$1.1m placement…',
        'ann_datetime' => '11-Sep-2026 20:43:41',
        'ann_status' => 'New',
        'ann_reference' => 'SG260911OTHR4TNS',
        'ann_submitted_by' => 'Thng Chong Kim',
        'ann_designation' => 'Executive Chairman',
        'ann_description' => 'Please refer to the attached.',
        '_attachments' => [
            ['name' => 'MetaOptics - Sep 2026 Placement Press Release.pdf', 'url' => 'https://links.sgx.com/FileOpen/x'],
        ],
        '_related' => [],
        '_labeled_rows' => [],
    ]);
    $this->assertSame('SG260911OTHR4TNS', $out['details']['announcement']['reference']);
    $this->assertNotSame($out['slug'], $out['details']['announcement']['reference']);
    $this->assertSame('GENERAL<br/>ANNOUNCEMENT', $out['title_banner']);
    $this->assertSame('METAOPTICS LTD', $out['details']['issuer']['name']);
    $this->assertCount(1, $out['details']['attachments']);
}
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Sgx/LayoutTitleDeriverTest.php \
  tests/unit/Sgx/AnnouncementPresenterLegacyTest.php
```

- [ ] **Step 3: Implement deriver + rewrite `fromRow`**

Omit empty optional blocks (`additional`, `related`, `eventNarrative`, …) when all empty. Map labeled rows → `details.additional.left` etc. and `eventNarrative` / `eventDates.left|right` / `eventVenues`. Use override columns when non-null/non-empty; else derive.

Update any tests that asserted the old flat Presenter keys. Prefer single legacy shape for public API.

- [ ] **Step 4: Run unit tests + fix broken API/presenter callers**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Sgx/LayoutTitleDeriverTest.php \
  tests/unit/Sgx/AnnouncementPresenterLegacyTest.php \
  tests/unit/Sgx
```

Expected: PASS (fix callers of old flat shape in the same commit)

- [ ] **Step 5: Commit**

```bash
git add backend/app/Libraries/Sgx/LayoutTitleDeriver.php \
  backend/app/Libraries/Sgx/AnnouncementPresenter.php \
  backend/tests/unit/Sgx/LayoutTitleDeriverTest.php \
  backend/tests/unit/Sgx/AnnouncementPresenterLegacyTest.php
git commit -m "$(cat <<'EOF'
feat(backend): present announcements in FE legacy JSON shape

EOF
)"
```

---

### Task 3: Detail writer + hydrate for API

**Files:**
- Create: `backend/app/Libraries/Admin/AnnouncementDetailWriter.php`
- Create: `backend/app/Libraries/Sgx/AnnouncementDetailHydrator.php`
- Modify: `backend/app/Controllers/Api/Announcements.php`
- Test: `backend/tests/unit/Admin/AnnouncementDetailWriterTest.php`

**Interfaces:**
- Consumes: `AnnouncementDetailWriter::replace(int $announcementId, array $scalars, array $attachments, array $related, array $labeledRows): void` (transactional delete+insert children + update scalars)
- Produces: `AnnouncementDetailHydrator::hydrate(array $row): array` adding `_attachments`, `_related`, `_labeled_rows`

- [ ] **Step 1: Failing writer test** — insert announcement, `replace` with 1 attachment + 1 labeled row, assert DB counts and re-read via hydrator.

- [ ] **Step 2: Run — FAIL**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/AnnouncementDetailWriterTest.php
```

- [ ] **Step 3: Implement writer + hydrator; wire Api `index`/`show`**

```php
// Api\Announcements::show — after fetch row:
$row = AnnouncementDetailHydrator::hydrate($row);
return $this->response->setJSON(['data' => AnnouncementPresenter::fromRow($row)]);
```

Same hydrate map for `index` rows. N+1 OK at ~66 rows.

- [ ] **Step 4: PASS tests**

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(backend): persist and hydrate announcement detail children

EOF
)"
```

---

### Task 4: JSON importer + spark command

**Files:**
- Create: `backend/app/Libraries/Admin/JsonAnnouncementImporter.php`
- Create: `backend/app/Commands/AnnouncementsImportJson.php` (`announcements:import-json`)
- Create: `backend/tests/_support/Fixtures/announcements/fe-parity-one.json` (copy **one** real object from `src/constants/announcements.json` — press-release slug)
- Test: `backend/tests/unit/Admin/JsonAnnouncementImporterTest.php`

**Interfaces:**
- Consumes: absolute path to JSON file (array of legacy items)
- Produces: `import(string $absolutePath): array{inserted:int,updated:int}` — upsert by `slug`; set `state=published`; `source=sgx` if reference present else `manual`; `sgx_reference`/`ann_reference` from `details.announcement.reference`; `summary` from `desc`; parse `date` → `filed_at`; write layout columns from JSON; call `AnnouncementDetailWriter`; **no** email side effects

**Parse `date`:** accept `d M Y h:i A` in Asia/Singapore (e.g. `11 Sep 2026 08:43 PM`).

- [ ] **Step 1: Failing importer test**

```php
public function test_import_fixture_publishes_and_presenter_matches_reference(): void
{
    $path = SUPPORTPATH . 'Fixtures/announcements/fe-parity-one.json';
    $result = (new JsonAnnouncementImporter(db_connect()))->import($path);
    $this->assertSame(1, $result['inserted'] + $result['updated']);
    $row = model(AnnouncementModel::class)->where(
        'slug',
        'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly'
    )->first();
    $this->assertSame('published', $row['state']);
    $hydrated = AnnouncementDetailHydrator::hydrate($row);
    $out = AnnouncementPresenter::fromRow($hydrated);
    $this->assertSame('SG260911OTHR4TNS', $out['details']['announcement']['reference']);
    $this->assertNotEmpty($out['details']['attachments']);
}
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement importer + command**

```php
// Commands/AnnouncementsImportJson.php
protected $name = 'announcements:import-json';
// usage: php spark announcements:import-json /absolute/path/to/announcements.json
// default: ROOTPATH . '../src/constants/announcements.json' when exists, else error
```

- [ ] **Step 4: PASS unit test**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage tests/unit/Admin/JsonAnnouncementImporterTest.php
cd backend && php spark list | grep announcements:import-json
```

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(backend): import announcements.json into published FE-parity rows

EOF
)"
```

---

### Task 5: SGX normalizer + sync merge (do not wipe details)

**Files:**
- Modify: `backend/app/Libraries/Sgx/AnnouncementNormalizer.php`
- Modify: `backend/app/Libraries/Sgx/SyncService.php`
- Modify: `backend/tests/unit/Sgx/AnnouncementNormalizerTest.php`
- Modify: `backend/tests/unit/Sgx/SyncServiceTest.php`

**Interfaces:**
- Nested `details` present → normalizer returns detail scalars + `_attachments` / `_related` / `_labeled_rows`
- Flat SGX API (`ref_id`) → core fields only; **no** empty wipe keys
- `SyncService::upsertAll`: insert writes details if present; hash-change updates core + `needs_review=1`, **keeps slug**; call `AnnouncementDetailWriter::replace` only when details present; otherwise leave children/scalars untouched

- [ ] **Step 1: Failing tests**

```php
public function test_hash_change_keeps_slug_and_existing_attachment_when_api_item_has_no_details(): void
{
    // seed published row with attachment + known slug
    // sync flat API item same ref_id, different title/hash, no details
    // assert slug unchanged, attachment count 1, needs_review === 1
}

public function test_nested_fixture_item_writes_ann_reference_and_attachment(): void
{
    // sync nested item → ann_reference + attachment row
}
```

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement merge behavior** (smallest diff in `upsertAll`)

- [ ] **Step 4: PASS SyncService + Normalizer tests**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Sgx/SyncServiceTest.php \
  tests/unit/Sgx/AnnouncementNormalizerTest.php
```

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
fix(backend): SGX sync merges core fields without wiping FE details

EOF
)"
```

---

### Task 6: Admin layout overrides + Publish → Email Alert draft offer

**Files:**
- Create: `backend/app/Libraries/Admin/AlertDraftFromAnnouncementService.php`
- Modify: `backend/app/Controllers/Admin/Announcements.php`
- Modify: `backend/app/Controllers/Admin/EmailAlerts.php` (`formView` prefill)
- Modify: `backend/app/Views/admin/announcements/show.php`
- Modify: `backend/app/Views/admin/email_alerts/form.php` (use prefill vars when `$alert` null)
- Modify: `backend/app/Config/Routes.php`
- Test: `backend/tests/unit/Admin/AlertDraftFromAnnouncementServiceTest.php`
- Test: `backend/tests/feature/Admin/AnnouncementPublishAlertOfferTest.php`

**Interfaces:**
- `AlertDraftFromAnnouncementService::createDraft(int $announcementId): int`
  - Require `state=published`
  - `AlertLifecycleService::saveDraft([
      'name' => null,
      'subject' => (string) $row['title'],
      'intro' => ($row['summary'] ?? '') !== '' ? $row['summary'] : null,
      'body_html' => '<p>{{announcement}}</p>',
    ], [$announcementId])`
  - Categories come from attach → `AudienceResolver::categoryUnion` on compose UI
- Publish when `PublishService::publish` returns `true` → redirect `/admin/announcements/{id}?offer_alert=1`
- `offer_alert=1` + published → modal; Yes → POST `/admin/announcements/{id}/create-alert-draft` → redirect `/admin/email-alerts/{newId}/edit`; No → dismiss
- Already published (`changed=false`) → **no** `offer_alert`
- Layout POST `/admin/announcements/{id}/layout` — empty string stores NULL for `title_btn`, `title_btn_sm`, `title_banner`
- `EmailAlerts::formView`: if creating and one selected id, set `prefill_subject` / `prefill_intro` / `prefill_body_html` from that announcement

- [ ] **Step 1: Failing unit + feature tests** (CSRF/session patterns from `EmailAlertsAdminTest` / `AdminPublishSendTest`)

- [ ] **Step 2: Run — FAIL**

- [ ] **Step 3: Implement service, routes, controller, modal (existing `admin.css`)

- [ ] **Step 4: PASS**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Admin/AlertDraftFromAnnouncementServiceTest.php \
  tests/feature/Admin/AnnouncementPublishAlertOfferTest.php
```

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(cms): offer prefilled email alert draft after publish

EOF
)"
```

---

### Task 7: FE mapper + detail fetch (flags stay false)

**Files:**
- Modify: `src/lib/announcements-api.js`
- Modify: `src/lib/announcements-api.test.mjs`
- Modify: `src/app/investor-relations/company-announcement/[slug]/page.js`
- Modify: `src/app/company-announcement/[slug]/page.js`
- Do **not** change `src/constants/ir-feature-flags.js` flag values

**Interfaces:**
- `mapApiAnnouncementToLegacy(row)` — if row has `details.announcement`, pass through (normalize types); else flat map must set reference from `ann_reference` — **never** slug
- `fetchAnnouncementBySlug(slug)` → `GET {NEXT_PUBLIC_IR_API_BASE}/api/announcements/{slug}`
- Detail pages: when `useAnnouncementsApi`, fetch by slug; on failure fall back to JSON; when false, keep JSON/SSG

- [ ] **Step 1: Failing node test**

```js
test('mapApiAnnouncementToLegacy never uses slug as SGX reference', () => {
  const legacy = mapApiAnnouncementToLegacy({
    id: 67,
    slug: 'general-announcement-press-release-mot-announces-s1-1m-placement-for-full-automation-of-metalens-camera-modules-assembly',
    title: 'X',
    category: 'General Announcement',
    filed_at: '2026-09-11T20:43:00+08:00',
    details: {
      announcement: { reference: 'SG260911OTHR4TNS', subTitle: 'Press', title: 'General Announcement' },
      issuer: { name: 'METAOPTICS LTD' },
      attachments: [],
    },
    title_banner: 'GENERAL<br/>ANNOUNCEMENT',
    title_btn: 'X',
    title_btn_sm: 'X',
    desc: '',
    date: '11 Sep 2026 8:43 PM',
  });
  assert.equal(legacy.details.announcement.reference, 'SG260911OTHR4TNS');
  assert.equal(legacy.title_banner, 'GENERAL<br/>ANNOUNCEMENT');
});
```

- [ ] **Step 2: Run**

```bash
node --test src/lib/announcements-api.test.mjs
```

- [ ] **Step 3: Implement mapper + fetchBySlug + detail flag branches**

- [ ] **Step 4: PASS; confirm flags still false**

```bash
node --test src/lib/announcements-api.test.mjs
grep -n "useAnnouncementsApi:" src/constants/ir-feature-flags.js
# expect: useAnnouncementsApi: false
```

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(fe): accept FE-parity API payload without flipping launch flags

EOF
)"
```

---

### Task 8: Docs + regression sweep

**Files:**
- Modify: `docs/IR_SGX_MIRROR_CMS_EMAIL_CLIENT_SCOPE_EN.md`
- Modify: `backend/README.md`

- [ ] **Step 1: Docs** — FE parity import command; publish may offer Email Alert draft; API shape matches site JSON; flags remain gated until staging diff QA

- [ ] **Step 2: Regression**

```bash
cd backend && ./vendor/bin/phpunit --no-coverage \
  tests/unit/Admin tests/unit/Email tests/unit/Sgx \
  tests/feature/Admin \
  tests/database/AnnouncementCrudMigrationTest.php \
  tests/database/EmailAlertsMigrationTest.php \
  tests/database/AnnouncementFeParityMigrationTest.php
```

Expected: PASS

- [ ] **Step 3: `graphify update .`** (optional; note refuse-overwrite)

- [ ] **Step 4: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: FE–CMS announcement parity import and publish-alert offer

EOF
)"
```

---

## Self-review

**1. Spec coverage**

| Spec item | Task |
|-----------|------|
| Expand API/DB to FE shape | 1–3 |
| Layout derive + override | 2, 6 |
| Full normalize + attachments / optional blocks | 1, 3 (`labeled_rows`) |
| Import JSON → Published, keep slug, no email prompts | 4 |
| Presenter legacy shape; reference ≠ slug | 2, 7 |
| SGX sync same schema; no wipe; keep slug | 5 |
| Publish → prompt draft alert + prefill | 6 |
| Prefill attach/subject/intro/categories/token | 6 |
| FE detail by slug when flag on; flags not flipped | 7 |
| Docs + launch checklist | 8 |

**2. Placeholder scan:** No TBD; commands and assertions spelled out.

**3. Type consistency:** `createDraft(int): int` → `saveDraft`; hydrator keys `_attachments` / `_related` / `_labeled_rows`; importer uses `AnnouncementDetailWriter::replace`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-09-28-fe-cms-announcement-parity.md`. Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  

**2. Inline Execution** — execute tasks in this session with executing-plans checkpoints  

Which approach?
