<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AuditLogger;
use App\Libraries\Admin\PublishService;
use App\Models\AnnouncementModel;
use App\Models\AuditLogModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DomainException;

final class PublishServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_publish_sets_published_state(): void
    {
        $id = $this->insertAnnouncement(['state' => 'pending_review', 'needs_review' => 1]);

        (new PublishService())->publish($id);

        $row = (new AnnouncementModel())->find($id);
        $this->assertSame('published', $row['state']);
        $this->assertNotNull($row['published_at']);
        $this->assertSame(0, (int) $row['needs_review']);
    }

    public function test_publish_already_published_is_noop(): void
    {
        $id = $this->insertAnnouncement([
            'state' => 'published',
            'needs_review' => 0,
            'published_at' => '2025-01-01 00:00:00',
        ]);

        $changed = (new PublishService())->publish($id);

        $this->assertFalse($changed);
        $row = (new AnnouncementModel())->find($id);
        $this->assertSame('published', $row['state']);
        $this->assertSame('2025-01-01 00:00:00', $row['published_at']);
    }

    public function test_publish_not_found(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_found');
        (new PublishService())->publish(99999);
    }

    public function test_publish_archived_blocked(): void
    {
        $id = $this->insertAnnouncement(['state' => 'archived']);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('archived');
        (new PublishService())->publish($id);
    }

    public function test_audit_logger_writes_row(): void
    {
        (new AuditLogger())->write('publish', 'announcement', '12', ['ok' => true]);

        $row = (new AuditLogModel())->first();
        $this->assertSame('publish', $row['action']);
        $this->assertSame('announcement', $row['entity_type']);
        $this->assertSame('12', $row['entity_id']);
        $meta = is_string($row['metadata_json'])
            ? json_decode($row['metadata_json'], true)
            : $row['metadata_json'];
        $this->assertSame(['ok' => true], $meta);
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
