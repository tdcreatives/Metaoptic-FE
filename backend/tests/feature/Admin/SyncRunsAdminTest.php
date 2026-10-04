<?php
declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\AuditLogModel;
use App\Models\SyncRunModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use CodeIgniter\Test\FeatureTestTrait;
use Config\Sgx;
use Config\Services;

final class SyncRunsAdminTest extends CIUnitTestCase
{
    use DatabaseTestTrait;
    use FeatureTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    protected function tearDown(): void
    {
        Services::resetSingle('sgxClient');
        parent::tearDown();
    }

    public function test_index_has_sync_now_button(): void
    {
        $page = $this->withSession(['admin' => true])->get('/admin/sync-runs');
        $page->assertOK();
        $body = $page->getBody();
        $this->assertStringContainsString('Sync data now', $body);
        $this->assertStringContainsString('sync-runs/run-now', $body);
        $this->assertStringContainsString('sync-now-dialog', $body);
        $this->assertStringContainsString('admin-sync-now.js', $body);
        $this->assertStringContainsString('modal-card-sync', $body);
        $this->assertStringContainsString('Takes a few minutes', $body);
        $this->assertStringContainsString('Do not close or refresh this browser tab', $body);
        $this->assertStringContainsString('sync-now-step-busy', $body);
        $this->assertStringNotContainsString('confirm(', $body);
    }

    public function test_run_now_triggers_sync_and_audits(): void
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

        Services::injectMock('sgxClient', new class ($items) {
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
        });

        $result = $this->withSession(['admin' => true])->post(
            '/admin/sync-runs/run-now',
            $this->withCsrf([])
        );
        $result->assertRedirectTo('/admin/sync-runs');
        $this->assertStringContainsString('Sync OK', (string) session('message'));

        $run = (new SyncRunModel())->orderBy('id', 'DESC')->first();
        $this->assertNotNull($run);
        $this->assertSame('success', $run['status']);

        $audit = (new AuditLogModel())->where('action', 'sync_now')->first();
        $this->assertNotNull($audit);
        $this->assertStringContainsString('"ok":true', (string) $audit['metadata_json']);
    }

    public function test_run_now_json_returns_payload(): void
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

        Services::injectMock('sgxClient', new class ($items) {
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
        });

        $result = $this->withSession(['admin' => true])
            ->withHeaders([
                'Accept' => 'application/json',
                'X-Requested-With' => 'XMLHttpRequest',
            ])
            ->post('/admin/sync-runs/run-now', $this->withCsrf([]));

        $result->assertOK();
        $payload = json_decode((string) $result->getJSON(), true, 512, JSON_THROW_ON_ERROR);
        $this->assertTrue($payload['ok']);
        $this->assertFalse($payload['locked']);
        $this->assertStringContainsString('Sync OK', (string) $payload['message']);
    }

    /** @param array<string, string> $fields */
    private function withCsrf(array $fields): array
    {
        helper('security');
        $fields[csrf_token()] = csrf_hash();

        return $fields;
    }
}
