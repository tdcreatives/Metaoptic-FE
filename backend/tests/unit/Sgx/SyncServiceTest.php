<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Sgx\SyncLock;
use App\Libraries\Sgx\SyncService;
use App\Models\AnnouncementModel;
use App\Models\SyncRunModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\Sgx;
use InvalidArgumentException;
use RuntimeException;

final class SyncServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_backfill_publishes_new_and_dedupes_on_second_run(): void
    {
        $items = $this->page1Items();
        $result = $this->service(true)->run($items);

        $this->assertSame(2, $result->fetchedCount);
        $this->assertSame(2, $result->newCount);
        $this->assertSame(0, $result->updatedCount);

        $rows = (new AnnouncementModel())->findAll();
        $this->assertCount(2, $rows);
        $this->assertSame('sgx', $rows[0]['source']);
        $this->assertSame('published', $rows[0]['state']);
        $this->assertNotNull($rows[0]['published_at']);
        $this->assertSame('published', $rows[1]['state']);

        $again = $this->service(true)->run($items);
        $this->assertSame(0, $again->newCount);
        $this->assertSame(0, $again->updatedCount);
        $this->assertCount(2, (new AnnouncementModel())->findAll());
    }

    public function test_incremental_inserts_pending_review(): void
    {
        $result = $this->service(false)->run([$this->page1Items()[0]]);

        $this->assertSame(1, $result->newCount);
        $row = (new AnnouncementModel())->first();
        $this->assertSame('pending_review', $row['state']);
        $this->assertNull($row['published_at']);
        $this->assertSame('METAOPTICS LTD', $row['issuer_name']);
        $this->assertSame('METAOPTICS LTD', $row['securities_name']);
        $this->assertSame('SG25010100ABCDE', $row['ann_reference']);
        $this->assertSame('General Announcement', $row['ann_title']);
        $this->assertSame('METAOPTICS ENTERS MOU', $row['ann_subtitle']);
        $this->assertSame('MetaOptics Ltd', $row['ann_submitted_by']);
        $this->assertSame('15-Sep-2025 09:30:00', $row['ann_datetime']);
    }

    public function test_same_hash_backfills_missing_list_fe_scalars(): void
    {
        $item = $this->page1Items()[0];
        $this->service(false)->run([$item]);

        $model = new AnnouncementModel();
        $existing = $model->first();
        $model->update($existing['id'], [
            'issuer_name' => null,
            'ann_reference' => null,
            'ann_title' => null,
            'ann_subtitle' => null,
            'securities_name' => null,
            'ann_submitted_by' => null,
            'ann_datetime' => null,
        ]);

        $again = $this->service(false)->run([$item]);
        $this->assertSame(0, $again->newCount);
        $this->assertSame(0, $again->updatedCount);

        $filled = $model->find($existing['id']);
        $this->assertSame('METAOPTICS LTD', $filled['issuer_name']);
        $this->assertSame('SG25010100ABCDE', $filled['ann_reference']);
        $this->assertSame('General Announcement', $filled['ann_title']);
        $this->assertSame(
            0,
            db_connect()->table('announcement_attachments')->where('announcement_id', $existing['id'])->countAllResults()
        );
    }

    public function test_hash_change_sets_needs_review_and_keeps_summary(): void
    {
        $item = $this->page1Items()[0];
        $this->service(false)->run([$item]);

        $model = new AnnouncementModel();
        $existing = $model->first();
        $originalSlug = $existing['slug'];
        $model->update($existing['id'], ['summary' => 'Admin summary']);

        $item['title'] = 'General Announcement::METAOPTICS ENTERS MOU (REVISED)';
        $result = $this->service(false)->run([$item]);

        $this->assertSame(0, $result->newCount);
        $this->assertSame(1, $result->updatedCount);

        $updated = $model->find($existing['id']);
        $this->assertSame('Admin summary', $updated['summary']);
        $this->assertSame($originalSlug, $updated['slug']);
        $this->assertSame(1, (int) $updated['needs_review']);
        $this->assertSame('METAOPTICS ENTERS MOU (REVISED)', $updated['title']);
        $this->assertSame('pending_review', $updated['state']);
    }

    public function test_normalize_failure_marks_sync_run_failed_and_writes_nothing(): void
    {
        $valid = $this->page1Items()[0];
        $invalid = ['title' => 'bad', 'category_name' => 'General Announcement'];

        $this->expectException(InvalidArgumentException::class);
        try {
            $this->service(false)->run([$valid, $invalid]);
        } finally {
            $this->assertCount(0, (new AnnouncementModel())->findAll());
            $run = (new SyncRunModel())->first();
            $this->assertNotNull($run);
            $this->assertSame('failed', $run['status']);
            $this->assertSame(2, (int) $run['fetched_count']);
        }
    }

    public function test_mid_upsert_failure_rolls_back_and_marks_run_failed(): void
    {
        $items = $this->page1Items();
        (new AnnouncementModel())->insert([
            'sgx_reference' => 'PREEXISTING',
            'slug' => 'financial-statements-1h-results-sg25080100fghij',
            'source_url' => '',
            'title' => 'blocker',
            'category' => 'Financial Statements',
            'issuer' => '',
            'filed_at' => '2025-01-01 00:00:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('a', 64),
            'state' => 'pending_review',
            'needs_review' => 0,
        ]);

        $this->expectException(RuntimeException::class);
        try {
            $this->service(false)->run($items);
        } finally {
            $rows = (new AnnouncementModel())->findAll();
            $this->assertCount(1, $rows);
            $this->assertSame('PREEXISTING', $rows[0]['sgx_reference']);
            $run = (new SyncRunModel())->first();
            $this->assertNotNull($run);
            $this->assertSame('failed', $run['status']);
        }
    }

    public function test_hash_change_keeps_slug_and_existing_attachment_when_api_item_has_no_details(): void
    {
        $item = $this->page1Items()[0];
        $this->service(true)->run([$item]);

        $db = db_connect();
        $model = new AnnouncementModel();
        $existing = $model->first();
        $slug = $existing['slug'];
        $db->table('announcement_attachments')->insert([
            'announcement_id' => $existing['id'],
            'name' => 'Keep.pdf',
            'url' => 'https://example.test/keep.pdf',
            'sort_order' => 0,
        ]);

        $item['title'] = 'General Announcement::METAOPTICS ENTERS MOU (REVISED)';
        $result = $this->service(true)->run([$item]);

        $this->assertSame(0, $result->newCount);
        $this->assertSame(1, $result->updatedCount);

        $updated = $model->find($existing['id']);
        $this->assertSame($slug, $updated['slug']);
        $this->assertSame(1, (int) $updated['needs_review']);
        $this->assertSame('published', $updated['state']);
        $this->assertSame(
            1,
            $db->table('announcement_attachments')->where('announcement_id', $existing['id'])->countAllResults()
        );
    }

    public function test_nested_fixture_item_writes_ann_reference_and_attachment(): void
    {
        $item = json_decode(
            (string) file_get_contents(SUPPORTPATH . 'Fixtures/announcements/fe-parity-one.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )[0];

        $result = $this->service(false)->run([$item]);
        $this->assertSame(1, $result->newCount);

        $row = (new AnnouncementModel())->first();
        $this->assertSame('SG260911OTHR4TNS', $row['sgx_reference']);
        $this->assertSame('SG260911OTHR4TNS', $row['ann_reference']);
        $this->assertSame('pending_review', $row['state']);
        $this->assertSame(
            1,
            db_connect()->table('announcement_attachments')->where('announcement_id', $row['id'])->countAllResults()
        );
    }

    public function test_sync_lock_acquire_is_true_on_sqlite(): void
    {
        $lock = new SyncLock(db_connect());
        $this->assertTrue($lock->acquire('sgx_sync'));
        $lock->release('sgx_sync');
    }

    public function test_html_enrichment_writes_description_and_attachments(): void
    {
        $item = $this->page1Items()[0];
        $item['url'] = 'https://links.sgx.com/1.0.0/corporate-announcements/C4QY18LURFPWL4L5/hash';
        $html = (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/detail-disclosure.html');

        $result = $this->service(false, static fn (string $url): string => $html)->run([$item]);
        $this->assertSame(1, $result->newCount);

        $row = (new AnnouncementModel())->first();
        $this->assertSame('SG25010100ABCDE', $row['ann_reference']);
        $this->assertSame('Executive Chairman', $row['ann_designation']);
        $this->assertStringContainsString('Please refer to the attachment.', (string) $row['ann_description']);
        $this->assertSame(
            2,
            db_connect()->table('announcement_attachments')->where('announcement_id', $row['id'])->countAllResults()
        );
    }

    private function service(bool $backfill, ?callable $htmlFetcher = null): SyncService
    {
        $config = new Sgx();
        $config->backfill = $backfill;
        $config->fetchDetailHtml = $htmlFetcher !== null;

        return new SyncService(db_connect(), $config, $htmlFetcher);
    }

    /** @return list<array<string, mixed>> */
    private function page1Items(): array
    {
        $decoded = json_decode(
            (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        );

        return $decoded['data'];
    }
}
