<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\UnsubscribeService;
use App\Libraries\Email\UnsubscribeToken;
use App\Models\SubscriberCategoryModel;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class UnsubscribeServiceTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    private const SECRET = 'unit-test-secret-min-32-chars-long!!';

    public function test_valid_token_sets_unsubscribed_keeps_email(): void
    {
        $tokens = new UnsubscribeToken(self::SECRET);
        $id = $this->insertActive('keep@example.com', $tokens, ['General Announcement']);
        $plain = $tokens->forSubscriber($id);

        (new UnsubscribeService($tokens))->unsubscribe($plain);

        $row = (new SubscriberModel())->find($id);
        $this->assertSame('unsubscribed', $row['status']);
        $this->assertSame('keep@example.com', $row['email']);
        $this->assertSame('Ivy', $row['first_name']);
        $this->assertNotNull($row['unsubscribed_at']);
        $this->assertSame($tokens->hashPlain($plain), $row['unsubscribe_token_hash']);
        $this->assertCount(1, (new SubscriberCategoryModel())->where('subscriber_id', $id)->findAll());
    }

    public function test_invalid_or_empty_token_is_noop(): void
    {
        $tokens = new UnsubscribeToken(self::SECRET);
        $id = $this->insertActive('still@example.com', $tokens);

        (new UnsubscribeService($tokens))->unsubscribe('');
        (new UnsubscribeService($tokens))->unsubscribe('not-a-real-token');

        $row = (new SubscriberModel())->find($id);
        $this->assertSame('active', $row['status']);
        $this->assertNull($row['unsubscribed_at']);
    }

    public function test_already_unsubscribed_stays_unsubscribed(): void
    {
        $tokens = new UnsubscribeToken(self::SECRET);
        $id = $this->insertActive('done@example.com', $tokens);
        $plain = $tokens->forSubscriber($id);
        $svc = new UnsubscribeService($tokens);
        $svc->unsubscribe($plain);
        $firstAt = (new SubscriberModel())->find($id)['unsubscribed_at'];

        $svc->unsubscribe($plain);

        $row = (new SubscriberModel())->find($id);
        $this->assertSame('unsubscribed', $row['status']);
        $this->assertSame($firstAt, $row['unsubscribed_at']);
        $this->assertSame(1, (new SubscriberModel())->countAllResults());
    }

    /** @param list<string> $categories */
    private function insertActive(string $email, UnsubscribeToken $tokens, array $categories = []): int
    {
        $id = (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => 'Ivy',
            'last_name' => 'R',
            'status' => 'active',
            'consented_at' => '2026-01-01 00:00:00',
            'unsubscribed_at' => null,
            'unsubscribe_token_hash' => null,
        ], true);
        $plain = $tokens->forSubscriber($id);
        (new SubscriberModel())->update($id, [
            'unsubscribe_token_hash' => $tokens->hashPlain($plain),
        ]);
        foreach ($categories as $key) {
            (new SubscriberCategoryModel())->insert([
                'subscriber_id' => $id,
                'category_key' => $key,
            ]);
        }

        return $id;
    }
}
