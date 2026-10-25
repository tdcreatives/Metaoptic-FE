<?php
declare(strict_types=1);

namespace Tests\Unit\Quote;

use App\Libraries\Quote\QuoteDigestAudience;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class QuoteDigestAudienceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_active_press_release_subscribers_includes_active_only(): void
    {
        $this->insertSubscriber('active@example.com', 'active', [QuoteDigestAudience::CATEGORY]);
        $this->insertSubscriber('inactive@example.com', 'unsubscribed', [QuoteDigestAudience::CATEGORY]);
        $this->insertSubscriber('other@example.com', 'active', ['Placements']);

        $rows = (new QuoteDigestAudience())->activePressReleaseSubscribers();

        $this->assertCount(1, $rows);
        $this->assertSame('active@example.com', $rows[0]['email']);
        $this->assertArrayHasKey('id', $rows[0]);
    }

    /** @param list<string> $categories */
    private function insertSubscriber(string $email, string $status, array $categories): void
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
    }
}
