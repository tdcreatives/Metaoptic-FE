<?php
declare(strict_types=1);

namespace Tests\Database;

use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class EmailAlertsMigrationTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_email_alerts_schema_and_campaign_link(): void
    {
        $db = db_connect();
        $this->assertTrue($db->tableExists('email_alerts'));
        $this->assertTrue($db->tableExists('email_alert_announcements'));
        $this->assertTrue($db->fieldExists('email_alert_id', 'email_campaigns'));

        $announcementId = $this->insertAnnouncement($db, 'alert-attach-slug');

        $db->table('email_alerts')->insert([
            'name' => 'September bundle',
            'subject' => 'IR update',
            'intro' => 'Hello',
            'body_html' => '<p>{{announcement}}</p>',
            'status' => 'draft',
        ]);
        $alertId = (int) $db->insertID();

        $db->table('email_alert_announcements')->insert([
            'email_alert_id' => $alertId,
            'announcement_id' => $announcementId,
            'sort_order' => 0,
        ]);

        $db->table('email_campaigns')->insert([
            'announcement_id' => null,
            'email_alert_id' => $alertId,
            'subject' => 'IR update',
            'body_html' => '<p>body</p>',
            'status' => 'queued',
        ]);

        $campaign = $db->table('email_campaigns')->where('email_alert_id', $alertId)->get()->getRowArray();
        $this->assertNull($campaign['announcement_id']);
        $this->assertSame($alertId, (int) $campaign['email_alert_id']);

        $otherAnnouncementId = $this->insertAnnouncement($db, 'alert-attach-slug-2');
        $db->table('email_campaigns')->insert([
            'announcement_id' => $announcementId,
            'email_alert_id' => null,
            'subject' => 'legacy a',
            'body_html' => '<p>a</p>',
            'status' => 'draft',
        ]);
        $db->table('email_campaigns')->insert([
            'announcement_id' => $announcementId,
            'email_alert_id' => null,
            'subject' => 'legacy b',
            'body_html' => '<p>b</p>',
            'status' => 'draft',
        ]);
        $this->assertSame(
            2,
            $db->table('email_campaigns')->where('announcement_id', $announcementId)->countAllResults(),
        );
        $this->assertGreaterThan(0, $otherAnnouncementId);
    }

    private function insertAnnouncement($db, string $slug): int
    {
        $db->table('announcements')->insert([
            'sgx_reference' => null,
            'slug' => $slug,
            'source_url' => '',
            'title' => 'Published item',
            'category' => 'General Announcement',
            'issuer' => '',
            'filed_at' => '2026-09-28 10:00:00',
            'source_payload' => '{}',
            'source_hash' => hash('sha256', $slug),
            'source' => 'manual',
            'state' => 'published',
            'needs_review' => 0,
        ]);

        return (int) $db->insertID();
    }
}
