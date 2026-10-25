<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AutoPublishNewItems;
use App\Libraries\Admin\FeDeployHook;
use App\Libraries\Email\LogMailer;
use App\Models\AdminRecipientModel;
use App\Models\AnnouncementModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use Config\Services;

final class AutoPublishNewItemsTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_empty_ids_noop(): void
    {
        $hook = new FeDeployHook('https://h.test', 5, static fn (): array => ['ok' => true, 'status' => 200]);
        $this->assertNull((new AutoPublishNewItems($hook))->run([]));
    }

    public function test_success_sets_live_and_digests(): void
    {
        $id = $this->insertAnnouncement(['state' => 'pending_review', 'needs_review' => 1]);

        (new AdminRecipientModel())->insert(['email' => 'ops@example.com', 'active' => 1]);
        $logPath = WRITEPATH . 'logs/mail-auto-pub-' . bin2hex(random_bytes(4)) . '.log';
        Services::injectMock('mailer', new LogMailer($logPath));

        $calls = 0;
        $hook = new FeDeployHook('https://h.test', 5, static function () use (&$calls): array {
            $calls++;

            return ['ok' => true, 'status' => 204];
        });

        try {
            $mode = (new AutoPublishNewItems($hook))->run([$id]);
            $this->assertSame('auto_published', $mode);
            $this->assertSame(1, $calls);

            $row = (new AnnouncementModel())->find($id);
            $this->assertSame('published', $row['state']);
            $this->assertNotNull($row['live_at']);
            $this->assertNotNull($row['published_at']);
            $this->assertSame(0, (int) $row['needs_review']);

            $mail = json_decode((string) file_get_contents($logPath), true);
            $this->assertStringContainsString('auto-published', strtolower((string) $mail['subject']));
        } finally {
            if (is_file($logPath)) {
                unlink($logPath);
            }
            Services::reset(true);
        }
    }

    public function test_hook_fail_rolls_back_to_pending_review(): void
    {
        $id = $this->insertAnnouncement(['state' => 'pending_review', 'needs_review' => 1]);

        $hook = new FeDeployHook('https://h.test', 5, static fn (): array => ['ok' => false, 'status' => 500]);
        $mode = (new AutoPublishNewItems($hook))->run([$id]);

        $this->assertSame('auto_publish_failed', $mode);
        $row = (new AnnouncementModel())->find($id);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNull($row['live_at']);
        $this->assertNull($row['published_at']);
        $this->assertSame(0, (int) $row['needs_review']);
    }

    public function test_empty_hook_url_rolls_back(): void
    {
        $id = $this->insertAnnouncement(['state' => 'pending_review', 'needs_review' => 1]);

        $hook = new FeDeployHook('', 5, static fn (): array => ['ok' => true, 'status' => 200]);
        $mode = (new AutoPublishNewItems($hook))->run([$id]);

        $this->assertSame('auto_publish_failed', $mode);
        $row = (new AnnouncementModel())->find($id);
        $this->assertSame('pending_review', $row['state']);
        $this->assertNull($row['live_at']);
        $this->assertNull($row['published_at']);
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
