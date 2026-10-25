<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AlertDraftFromAnnouncementService;
use App\Models\AnnouncementModel;
use App\Models\EmailAlertModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DomainException;

final class AlertDraftFromAnnouncementServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_create_draft_prefills_from_published_announcement(): void
    {
        $id = $this->insertAnnouncement('published', [
            'title' => 'Board Update',
            'summary' => 'Short intro',
        ]);

        $alertId = (new AlertDraftFromAnnouncementService())->createDraft($id);

        $alert = (new EmailAlertModel())->find($alertId);
        $this->assertNotNull($alert);
        $this->assertSame('draft', $alert['status']);
        $this->assertNull($alert['name']);
        $this->assertSame('Board Update', $alert['subject']);
        $this->assertSame('Short intro', $alert['intro']);
        $this->assertStringContainsString('Dear Investor', (string) $alert['body_html']);
        $this->assertStringContainsString('{{announcement}}', (string) $alert['body_html']);
        $this->assertStringContainsString('MetaOptics Investor Relations', (string) $alert['body_html']);

        $attach = db_connect()->table('email_alert_announcements')
            ->where('email_alert_id', $alertId)
            ->get()
            ->getRowArray();
        $this->assertNotNull($attach);
        $this->assertSame($id, (int) $attach['announcement_id']);
    }

    public function test_create_draft_null_intro_when_summary_empty(): void
    {
        $id = $this->insertAnnouncement('published', ['summary' => '']);

        $alertId = (new AlertDraftFromAnnouncementService())->createDraft($id);

        $alert = (new EmailAlertModel())->find($alertId);
        $this->assertNull($alert['intro']);
    }

    public function test_create_draft_rejects_unpublished(): void
    {
        $id = $this->insertAnnouncement('pending_review');

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_published');
        (new AlertDraftFromAnnouncementService())->createDraft($id);
    }

    public function test_create_draft_rejects_not_live_on_website(): void
    {
        $id = $this->insertAnnouncement('published', ['live_at' => null]);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_live_on_website');
        (new AlertDraftFromAnnouncementService())->createDraft($id);
    }

    public function test_create_draft_rejects_missing(): void
    {
        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_found');
        (new AlertDraftFromAnnouncementService())->createDraft(99999);
    }

    /** @param array<string, mixed> $overrides */
    private function insertAnnouncement(string $state, array $overrides = []): int
    {
        return (int) (new AnnouncementModel())->insert(array_merge([
            'sgx_reference' => 'ADF' . bin2hex(random_bytes(4)),
            'slug' => 'adf-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/adf',
            'title' => 'Item',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => hash('sha256', microtime()),
            'source' => 'manual',
            'summary' => 'Summary',
            'state' => $state,
            'published_at' => $state === 'published' ? '2026-09-28 10:00:00' : null,
            'live_at' => $state === 'published' ? '2026-09-28 10:00:00' : null,
            'needs_review' => 0,
        ], $overrides), true);
    }
}
