<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\AlertDispatchService;
use App\Libraries\Email\CampaignFanout;
use App\Models\AnnouncementModel;
use App\Models\EmailAlertAnnouncementModel;
use App\Models\EmailAlertModel;
use App\Models\EmailCampaignModel;
use App\Models\EmailDeliveryModel;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use DomainException;

final class AlertDispatchServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_dispatch_happy_path_snapshots_fans_out_and_marks_sent(): void
    {
        $aId = $this->insertAnnouncement('General Announcement', 'published', 'First item');
        $bId = $this->insertAnnouncement('Placements', 'published', 'Second item');
        $subA = $this->insertSubscriber('a@example.com', 'active', ['General Announcement']);
        $subB = $this->insertSubscriber('b@example.com', 'active', ['Placements']);

        $alertId = $this->insertAlert('draft', [$aId, $bId], '<p>{{announcement}}</p>', 'Hello');

        $campaignId = (new AlertDispatchService())->dispatch($alertId);

        $alert = (new EmailAlertModel())->find($alertId);
        $this->assertSame('sent', $alert['status']);
        $this->assertSame($campaignId, (int) $alert['campaign_id']);
        $this->assertNotNull($alert['sent_at']);
        $frozen = json_decode((string) $alert['audience_categories_json'], true);
        $this->assertSame(['General Announcement', 'Placements'], $frozen);

        $campaign = (new EmailCampaignModel())->find($campaignId);
        $this->assertNull($campaign['announcement_id']);
        $this->assertSame($alertId, (int) $campaign['email_alert_id']);
        $this->assertSame('queued', $campaign['status']);
        $this->assertSame('IR update', $campaign['subject']);
        $this->assertStringContainsString('Hello', (string) $campaign['body_html']);
        $this->assertStringContainsString('First item', (string) $campaign['body_html']);
        $this->assertStringContainsString('Second item', (string) $campaign['body_html']);

        $snaps = (new EmailAlertAnnouncementModel())
            ->where('email_alert_id', $alertId)
            ->orderBy('sort_order', 'ASC')
            ->findAll();
        $this->assertSame('First item', $snaps[0]['snap_title']);
        $this->assertSame('General Announcement', $snaps[0]['snap_category']);
        $this->assertSame('Second item', $snaps[1]['snap_title']);

        $deliveries = (new EmailDeliveryModel())->where('campaign_id', $campaignId)->findAll();
        $ids = array_map('intval', array_column($deliveries, 'subscriber_id'));
        sort($ids);
        $expected = [$subA, $subB];
        sort($expected);
        $this->assertSame($expected, $ids);
    }

    public function test_dispatch_rejects_unpublished_attach(): void
    {
        $pub = $this->insertAnnouncement('General Announcement', 'published', 'Pub');
        $pend = $this->insertAnnouncement('Placements', 'pending_review', 'Pend');
        $alertId = $this->insertAlert('draft', [$pub, $pend]);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_published');
        (new AlertDispatchService())->dispatch($alertId);
    }

    public function test_dispatch_rejects_non_draft_or_scheduled(): void
    {
        $ann = $this->insertAnnouncement('General Announcement', 'published', 'Pub');
        $alertId = $this->insertAlert('sent', [$ann]);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('not_draft_or_scheduled');
        (new AlertDispatchService())->dispatch($alertId);
    }

    public function test_fanout_failure_rolls_back_alert_and_campaign(): void
    {
        $ann = $this->insertAnnouncement('General Announcement', 'published', 'Pub');
        $this->insertSubscriber('a@example.com', 'active', ['General Announcement']);
        $alertId = $this->insertAlert('draft', [$ann]);

        $fanout = new class extends CampaignFanout {
            public function fanout(\PDO|\CodeIgniter\Database\BaseConnection $db, int $campaignId, array $categories): int
            {
                throw new \RuntimeException('fanout boom');
            }
        };

        try {
            (new AlertDispatchService(fanout: $fanout))->dispatch($alertId);
            $this->fail('expected fanout failure');
        } catch (\RuntimeException $e) {
            $this->assertSame('fanout boom', $e->getMessage());
        }

        $alert = (new EmailAlertModel())->find($alertId);
        $this->assertSame('draft', $alert['status']);
        $this->assertNull($alert['campaign_id']);
        $this->assertSame(0, (new EmailCampaignModel())->where('email_alert_id', $alertId)->countAllResults());
    }

    /** @param list<int> $announcementIds */
    private function insertAlert(
        string $status,
        array $announcementIds,
        string $bodyHtml = '<p>body</p>',
        ?string $intro = null,
    ): int {
        $alertId = (int) (new EmailAlertModel())->insert([
            'name' => 'Bundle',
            'subject' => 'IR update',
            'intro' => $intro,
            'body_html' => $bodyHtml,
            'status' => $status,
        ], true);

        $sort = 0;
        foreach ($announcementIds as $announcementId) {
            (new EmailAlertAnnouncementModel())->insert([
                'email_alert_id' => $alertId,
                'announcement_id' => $announcementId,
                'sort_order' => $sort++,
            ]);
        }

        return $alertId;
    }

    private function insertAnnouncement(string $category, string $state, string $title): int
    {
        return (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'DSP' . bin2hex(random_bytes(4)),
            'slug' => 'dsp-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/' . bin2hex(random_bytes(2)),
            'title' => $title,
            'category' => $category,
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2026-09-28 09:00:00',
            'source_payload' => '{}',
            'source_hash' => hash('sha256', $title . microtime()),
            'source' => 'manual',
            'summary' => 'Summary',
            'state' => $state,
            'published_at' => $state === 'published' ? '2026-09-28 10:00:00' : null,
            'live_at' => $state === 'published' ? '2026-09-28 10:00:00' : null,
            'needs_review' => 0,
        ], true);
    }

    /** @param list<string> $categories */
    private function insertSubscriber(string $email, string $status, array $categories): int
    {
        $id = (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => 'A',
            'last_name' => 'B',
            'status' => $status,
            'consented_at' => '2026-01-01 00:00:00',
            'unsubscribed_at' => $status === 'unsubscribed' ? '2026-02-01 00:00:00' : null,
        ], true);
        foreach ($categories as $key) {
            (new SubscriberCategoryModel())->insert([
                'subscriber_id' => $id,
                'category_key' => $key,
            ]);
        }

        return $id;
    }
}
