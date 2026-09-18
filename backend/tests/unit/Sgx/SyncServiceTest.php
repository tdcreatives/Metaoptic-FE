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
    }

    public function test_hash_change_sets_needs_review_and_keeps_summary(): void
    {
        $item = $this->page1Items()[0];
        $this->service(false)->run([$item]);

        $model = new AnnouncementModel();
        $existing = $model->first();
        $model->update($existing['id'], ['summary' => 'Admin summary']);

        $item['details']['announcement']['subTitle'] = 'METAOPTICS ENTERS MOU (REVISED)';
        $result = $this->service(false)->run([$item]);

        $this->assertSame(0, $result->newCount);
        $this->assertSame(1, $result->updatedCount);

        $updated = $model->find($existing['id']);
        $this->assertSame('Admin summary', $updated['summary']);
        $this->assertSame(1, (int) $updated['needs_review']);
        $this->assertSame('METAOPTICS ENTERS MOU (REVISED)', $updated['title']);
        $this->assertSame('pending_review', $updated['state']);
    }

    public function test_normalize_failure_marks_sync_run_failed_and_writes_nothing(): void
    {
        $valid = $this->page1Items()[0];
        $invalid = ['title' => 'bad', 'date' => '15 Sep 2025 09:30 AM', 'details' => ['announcement' => []]];

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

    public function test_sync_lock_acquire_is_true_on_sqlite(): void
    {
        $lock = new SyncLock(db_connect());
        $this->assertTrue($lock->acquire('sgx_sync'));
        $lock->release('sgx_sync');
    }

    private function service(bool $backfill): SyncService
    {
        $config = new Sgx();
        $config->backfill = $backfill;

        return new SyncService(db_connect(), $config);
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

        return $decoded['items'];
    }
}
