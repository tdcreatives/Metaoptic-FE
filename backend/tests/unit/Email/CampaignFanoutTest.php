<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\CampaignFanout;
use App\Models\AnnouncementModel;
use App\Models\EmailCampaignModel;
use App\Models\EmailDeliveryModel;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;
use PDO;
use PDOException;

final class CampaignFanoutTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_only_active_matching_category_gets_delivery(): void
    {
        $idA = $this->insertSubscriber('a@example.com', 'active', ['General Announcement']);
        $idB = $this->insertSubscriber('b@example.com', 'active', ['Financial Statements']);
        $idC = $this->insertSubscriber('c@example.com', 'unsubscribed', ['General Announcement']);

        $campaignId = $this->insertCampaign();
        $inserted = (new CampaignFanout())->fanout(db_connect(), $campaignId, ['General Announcement']);

        $deliveries = (new EmailDeliveryModel())->where('campaign_id', $campaignId)->findAll();
        $subscriberIds = array_map('intval', array_column($deliveries, 'subscriber_id'));
        sort($subscriberIds);

        $this->assertSame(1, $inserted);
        $this->assertSame([$idA], $subscriberIds);
        $this->assertSame('queued', $deliveries[0]['status']);
        $this->assertSame(1, (int) (new EmailCampaignModel())->find($campaignId)['recipient_count']);
        $this->assertNotContains($idB, $subscriberIds);
        $this->assertNotContains($idC, $subscriberIds);
    }

    public function test_fanout_two_categories_two_subscribers_without_dup(): void
    {
        $idA = $this->insertSubscriber('a@example.com', 'active', ['General Announcement']);
        $idB = $this->insertSubscriber('b@example.com', 'active', ['Placements']);
        $idBoth = $this->insertSubscriber('both@example.com', 'active', ['General Announcement', 'Placements']);

        $campaignId = $this->insertCampaign();
        $inserted = (new CampaignFanout())->fanout(
            db_connect(),
            $campaignId,
            ['General Announcement', 'Placements'],
        );

        $deliveries = (new EmailDeliveryModel())->where('campaign_id', $campaignId)->findAll();
        $subscriberIds = array_map('intval', array_column($deliveries, 'subscriber_id'));
        sort($subscriberIds);
        $expected = [$idA, $idB, $idBoth];
        sort($expected);

        $this->assertSame(3, $inserted);
        $this->assertSame($expected, $subscriberIds);
        $this->assertSame(3, (int) (new EmailCampaignModel())->find($campaignId)['recipient_count']);
    }

    public function test_fanout_is_idempotent_on_campaign_subscriber(): void
    {
        $this->insertSubscriber('a@example.com', 'active', ['General Announcement']);
        $campaignId = $this->insertCampaign();

        $fanout = new CampaignFanout();
        $db = db_connect();
        $this->assertSame(1, $fanout->fanout($db, $campaignId, ['General Announcement']));
        $this->assertSame(0, $fanout->fanout($db, $campaignId, ['General Announcement']));
        $this->assertSame(1, (new EmailDeliveryModel())->where('campaign_id', $campaignId)->countAllResults());
        $this->assertSame(1, (int) (new EmailCampaignModel())->find($campaignId)['recipient_count']);
    }

    public function test_bulk_insert_sql_is_present(): void
    {
        $src = (string) file_get_contents((new \ReflectionClass(CampaignFanout::class))->getFileName());
        $this->assertStringContainsString('INSERT IGNORE', $src);
        $this->assertStringContainsString('INSERT OR IGNORE', $src);
        $this->assertStringContainsString('prefixTable', $src);
        $this->assertStringContainsString('category_key IN', $src);
    }

    public function test_pdo_non_unique_errors_rethrow(): void
    {
        $pdo = new PDO('sqlite::memory:');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->exec('CREATE TABLE subscribers (id INTEGER PRIMARY KEY, status TEXT)');
        $pdo->exec('CREATE TABLE subscriber_categories (subscriber_id INTEGER, category_key TEXT)');
        $pdo->exec("INSERT INTO subscribers (id, status) VALUES (1, 'active')");
        $pdo->exec("INSERT INTO subscriber_categories (subscriber_id, category_key) VALUES (1, 'General Announcement')");

        $this->expectException(PDOException::class);
        (new CampaignFanout())->fanout($pdo, 1, ['General Announcement']);
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

    private function insertCampaign(): int
    {
        $announcementId = (int) (new AnnouncementModel())->insert([
            'sgx_reference' => 'FAN' . bin2hex(random_bytes(4)),
            'slug' => 'fan-' . bin2hex(random_bytes(4)),
            'source_url' => 'https://example.test/a',
            'title' => 'Published MOU',
            'category' => 'General Announcement',
            'issuer' => 'MetaOptics Ltd',
            'filed_at' => '2025-09-15 09:30:00',
            'source_payload' => '{}',
            'source_hash' => str_repeat('e', 64),
            'summary' => 'Public summary',
            'state' => 'published',
            'published_at' => '2025-09-15 10:00:00',
            'needs_review' => 0,
        ], true);

        return (int) (new EmailCampaignModel())->insert([
            'announcement_id' => $announcementId,
            'subject' => 's',
            'body_html' => 'b',
            'status' => 'queued',
        ], true);
    }
}
