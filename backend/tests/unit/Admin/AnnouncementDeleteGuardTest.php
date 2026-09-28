<?php
declare(strict_types=1);

namespace Tests\Unit\Admin;

use App\Libraries\Admin\AnnouncementDeleteGuard;
use App\Models\AnnouncementModel;
use App\Models\EmailAlertAnnouncementModel;
use App\Models\EmailAlertModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DomainException;

final class AnnouncementDeleteGuardTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_sending_alert_blocks_delete(): void
    {
        $annId = $this->insertAnnouncement();
        $this->insertAlert('sending', $annId);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('locked_sending');
        (new AnnouncementDeleteGuard())->assertCanDelete($annId);
    }

    public function test_draft_junction_is_removed(): void
    {
        $annId = $this->insertAnnouncement();
        $alertId = $this->insertAlert('draft', $annId);

        (new AnnouncementDeleteGuard())->assertCanDelete($annId);

        $this->assertSame(
            0,
            (new EmailAlertAnnouncementModel())->where('email_alert_id', $alertId)->countAllResults(),
        );
        (new AnnouncementModel())->delete($annId);
        $this->assertNull((new AnnouncementModel())->find($annId));
    }

    public function test_sent_junction_keeps_snapshot_and_nulls_fk(): void
    {
        $annId = $this->insertAnnouncement();
        $alertId = $this->insertAlert('sent', $annId);

        (new AnnouncementDeleteGuard())->assertCanDelete($annId);
        (new AnnouncementModel())->delete($annId);

        $row = (new EmailAlertAnnouncementModel())->where('email_alert_id', $alertId)->first();
        $this->assertNotNull($row);
        $this->assertNull($row['announcement_id']);
        $this->assertSame('Keep me', $row['snap_title']);
        $this->assertSame('General Announcement', $row['snap_category']);
        $this->assertNull((new AnnouncementModel())->find($annId));
    }

    private function insertAnnouncement(): int
    {
        return (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'DSP' . bin2hex(random_bytes(4)),
            'slug' => 'dsp-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/a',
            'title' => 'Keep me',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => hash('sha256', microtime()),
            'source' => 'manual',
            'summary' => 'Summary',
            'state' => 'published',
            'published_at' => '2026-09-28 10:00:00',
            'needs_review' => 0,
        ], true);
    }

    private function insertAlert(string $status, int $announcementId): int
    {
        $alertId = (int) (new EmailAlertModel())->insert([
            'name' => 'Bundle',
            'subject' => 'IR update',
            'body_html' => '<p>body</p>',
            'status' => $status,
        ], true);
        (new EmailAlertAnnouncementModel())->insert([
            'email_alert_id' => $alertId,
            'announcement_id' => $announcementId,
            'sort_order' => 0,
        ]);

        return $alertId;
    }
}
