<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\AudienceResolver;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class AudienceResolverTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_category_union_is_unique(): void
    {
        $union = (new AudienceResolver())->categoryUnion([
            ['category' => 'General Announcement'],
            ['category' => '  General Announcement  '],
            ['category' => 'Placements'],
            ['category' => ''],
            ['category' => null],
            [],
        ]);

        $this->assertSame(['General Announcement', 'Placements'], $union);
    }

    public function test_estimate_zero_when_no_categories(): void
    {
        $this->assertSame(0, (new AudienceResolver())->estimateSubscriberCount([]));
    }

    public function test_estimate_distinct_active_matching_any_category(): void
    {
        $this->insertSubscriber('both@example.com', 'active', ['General Announcement', 'Placements']);
        $this->insertSubscriber('one@example.com', 'active', ['Placements']);
        $this->insertSubscriber('other@example.com', 'active', ['Annual Reports']);
        $this->insertSubscriber('gone@example.com', 'unsubscribed', ['General Announcement']);

        $count = (new AudienceResolver())->estimateSubscriberCount([
            'General Announcement',
            'Placements',
        ]);

        $this->assertSame(2, $count);
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
