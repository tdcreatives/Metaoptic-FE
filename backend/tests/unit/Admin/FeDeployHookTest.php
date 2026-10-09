<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\ArchiveService;
use App\Libraries\Admin\FeDeployHook;
use App\Libraries\Admin\PublishService;
use App\Libraries\Admin\PublishToLiveSiteService;
use App\Models\AnnouncementModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class FeDeployHookTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_empty_url_is_noop(): void
    {
        $called = false;
        $hook = new FeDeployHook('', 5, static function () use (&$called): array {
            $called = true;

            return ['ok' => true, 'status' => 200];
        });

        $hook->trigger('publish');
        $this->assertFalse($called);
    }

    public function test_trigger_posts_when_url_set(): void
    {
        $seen = [];
        $hook = new FeDeployHook(
            'https://hooks.example.test/deploy',
            3,
            static function (string $url, int $timeout) use (&$seen): array {
                $seen = ['url' => $url, 'timeout' => $timeout];

                return ['ok' => true, 'status' => 204];
            }
        );

        $hook->trigger('publish');
        $this->assertSame('https://hooks.example.test/deploy', $seen['url']);
        $this->assertSame(3, $seen['timeout']);
    }

    public function test_cms_publish_and_archive_do_not_trigger_hook(): void
    {
        $calls = 0;
        $hook = new FeDeployHook('https://hooks.example.test/deploy', 5, static function () use (&$calls): array {
            $calls++;

            return ['ok' => true, 'status' => 200];
        });

        $id = $this->insertAnnouncement(['state' => 'pending_review']);
        $this->assertTrue((new PublishService())->publish($id));
        $this->assertSame(0, $calls);

        $this->assertTrue((new ArchiveService())->archive($id));
        $this->assertSame(0, $calls);
    }

    public function test_publish_to_live_site_triggers_hook_and_sets_live_at(): void
    {
        $calls = 0;
        $hook = new FeDeployHook('https://hooks.example.test/deploy', 5, static function () use (&$calls): array {
            $calls++;

            return ['ok' => true, 'status' => 200];
        });

        $pubId = $this->insertAnnouncement([
            'state' => 'published',
            'published_at' => '2026-10-01 10:00:00',
            'live_at' => null,
            'needs_review' => 0,
        ]);
        $archId = $this->insertAnnouncement([
            'state' => 'archived',
            'published_at' => '2026-09-01 10:00:00',
            'live_at' => '2026-09-02 10:00:00',
            'needs_review' => 0,
        ]);

        $result = (new PublishToLiveSiteService($hook))->run();
        $this->assertSame(1, $calls);
        $this->assertSame(1, $result['synced_published']);
        $this->assertSame(1, $result['cleared']);

        $pub = (new AnnouncementModel())->find($pubId);
        $arch = (new AnnouncementModel())->find($archId);
        $this->assertNotEmpty($pub['live_at']);
        $this->assertNull($arch['live_at']);
    }

    public function test_hook_failure_does_not_block_live_sync_db(): void
    {
        $hook = new FeDeployHook('https://hooks.example.test/deploy', 5, static function (): array {
            return ['ok' => false, 'status' => 500, 'error' => 'boom'];
        });

        $id = $this->insertAnnouncement([
            'state' => 'published',
            'published_at' => '2026-10-01 10:00:00',
            'live_at' => null,
            'needs_review' => 0,
        ]);
        (new PublishToLiveSiteService($hook))->run();
        $this->assertNotEmpty((new AnnouncementModel())->find($id)['live_at']);
    }

    /** @param array<string, mixed> $overrides */
    private function insertAnnouncement(array $overrides): int
    {
        $id = (new AnnouncementModel())->insert(array_merge([
            'sgx_reference' => 'CMS' . bin2hex(random_bytes(4)),
            'slug' => 'cms-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/a',
            'title' => 'Pending MOU',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('c', 64),
            'summary' => 'Draft summary',
            'state' => 'pending_review',
            'needs_review' => 1,
        ], $overrides), true);

        return (int) $id;
    }
}
