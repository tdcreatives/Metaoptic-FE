<?php
declare(strict_types=1);

namespace Tests\Unit\Sgx;

use App\Libraries\Admin\FeDeployHook;
use App\Libraries\Sgx\SgxSyncRunner;
use App\Models\AnnouncementModel;
use App\Models\SyncRunModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\Sgx;
use Config\Services;
use RuntimeException;

final class SgxSyncRunnerTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    protected function tearDown(): void
    {
        Services::resetSingle('sgxClient');
        parent::tearDown();
    }

    public function test_run_success_writes_sync_run(): void
    {
        $cfg = config(Sgx::class);
        $cfg->fetchDetailHtml = false;
        $cfg->backfill = true;

        $items = json_decode(
            (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )['data'];

        $fake = new class ($items) {
            public function __construct(private readonly array $items)
            {
            }

            public function fetchAllPages(): array
            {
                return $this->items;
            }

            public function fetchHtml(string $url): string
            {
                return '';
            }
        };
        Services::injectMock('sgxClient', $fake);

        $out = (new SgxSyncRunner())->run();
        $this->assertTrue($out['ok']);
        $this->assertFalse($out['locked']);
        $this->assertStringContainsString('fetched=2', $out['message']);
        $this->assertSame(2, $out['result']?->newCount);

        $run = (new SyncRunModel())->orderBy('id', 'DESC')->first();
        $this->assertNotNull($run);
        $this->assertSame('success', $run['status']);
    }

    public function test_run_failure_returns_sync_failed_message(): void
    {
        $fake = new class {
            public function fetchAllPages(): array
            {
                throw new RuntimeException('boom-network');
            }

            public function fetchHtml(string $url): string
            {
                return '';
            }
        };
        Services::injectMock('sgxClient', $fake);

        $out = (new SgxSyncRunner())->run();
        $this->assertFalse($out['ok']);
        $this->assertStringContainsString('SYNC_FAILED:', $out['message']);
        $this->assertStringContainsString('boom-network', $out['message']);
    }

    public function test_auto_publish_on_new_items_lives_and_hooks_once(): void
    {
        $cfg = config(Sgx::class);
        $cfg->fetchDetailHtml = false;
        $cfg->backfill = false;
        $cfg->autoPublish = true;

        $items = [$this->fixtureItems()[0]];
        $hookCalls = 0;
        $hook = new FeDeployHook('https://h.test', 5, static function () use (&$hookCalls): array {
            $hookCalls++;

            return ['ok' => true, 'status' => 204];
        });

        $out = (new SgxSyncRunner(null, $this->fakeClient($items), $hook))->run();
        $this->assertTrue($out['ok']);
        $this->assertSame(1, $hookCalls);

        $row = (new AnnouncementModel())->where('sgx_reference', 'SG25010100ABCDE')->first();
        $this->assertNotNull($row);
        $this->assertSame('published', $row['state']);
        $this->assertNotNull($row['live_at']);
    }

    public function test_auto_publish_off_keeps_pending_review(): void
    {
        $cfg = config(Sgx::class);
        $cfg->fetchDetailHtml = false;
        $cfg->backfill = false;
        $cfg->autoPublish = false;

        $items = [$this->fixtureItems()[0]];
        $out = (new SgxSyncRunner(null, $this->fakeClient($items)))->run();
        $this->assertTrue($out['ok']);

        $row = (new AnnouncementModel())->where('sgx_reference', 'SG25010100ABCDE')->first();
        $this->assertNotNull($row);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNull($row['live_at']);
    }

    public function test_auto_publish_hook_fail_leaves_pending_review(): void
    {
        $cfg = config(Sgx::class);
        $cfg->fetchDetailHtml = false;
        $cfg->backfill = false;
        $cfg->autoPublish = true;

        $items = [$this->fixtureItems()[0]];
        $hook = new FeDeployHook('https://h.test', 5, static fn (): array => ['ok' => false, 'status' => 500]);

        $out = (new SgxSyncRunner(null, $this->fakeClient($items), $hook))->run();
        $this->assertTrue($out['ok']);

        $row = (new AnnouncementModel())->where('sgx_reference', 'SG25010100ABCDE')->first();
        $this->assertNotNull($row);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNull($row['live_at']);
    }

    /** @return list<array<string, mixed>> */
    private function fixtureItems(): array
    {
        return json_decode(
            (string) file_get_contents(SUPPORTPATH . 'Fixtures/sgx/list-page-1.json'),
            true,
            512,
            JSON_THROW_ON_ERROR
        )['data'];
    }

    /** @param list<array<string, mixed>> $items */
    private function fakeClient(array $items): object
    {
        return new class ($items) {
            public function __construct(private readonly array $items)
            {
            }

            public function fetchAllPages(): array
            {
                return $this->items;
            }

            public function fetchHtml(string $url): string
            {
                return '';
            }
        };
    }
}
