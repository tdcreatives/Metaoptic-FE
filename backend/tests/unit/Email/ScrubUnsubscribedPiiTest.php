<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Commands\ScrubUnsubscribedPii;
use App\Models\SubscriberModel;
use CodeIgniter\Test\CIUnitTestCase;
use CodeIgniter\Test\DatabaseTestTrait;

final class ScrubUnsubscribedPiiTest extends CIUnitTestCase
{
    use DatabaseTestTrait;

    protected $migrate = true;
    protected $refresh = true;
    protected $namespace = 'App';

    public function test_command_is_registered(): void
    {
        $this->assertArrayHasKey('email:scrub-pii', service('commands')->getCommands());
        $this->assertSame(
            'email:scrub-pii',
            (new ScrubUnsubscribedPii(service('logger'), service('commands')))->name
        );
    }

    public function test_scrubs_names_after_30_days_keeps_email_and_recent_or_active(): void
    {
        $oldUnsub = $this->insertSubscriber(
            'old-unsub@example.com',
            'unsubscribed',
            'Ada',
            'Lovelace',
            date('Y-m-d H:i:s', strtotime('-31 days')),
        );
        $recentUnsub = $this->insertSubscriber(
            'recent-unsub@example.com',
            'unsubscribed',
            'Grace',
            'Hopper',
            date('Y-m-d H:i:s', strtotime('-10 days')),
        );
        $active = $this->insertSubscriber(
            'active@example.com',
            'active',
            'Alan',
            'Turing',
            null,
        );

        (new ScrubUnsubscribedPii(service('logger'), service('commands')))->run([]);

        $old = (new SubscriberModel())->find($oldUnsub);
        $this->assertSame('old-unsub@example.com', $old['email']);
        $this->assertNull($old['first_name']);
        $this->assertNull($old['last_name']);
        $this->assertSame('unsubscribed', $old['status']);

        $recent = (new SubscriberModel())->find($recentUnsub);
        $this->assertSame('Grace', $recent['first_name']);
        $this->assertSame('Hopper', $recent['last_name']);
        $this->assertSame('recent-unsub@example.com', $recent['email']);

        $still = (new SubscriberModel())->find($active);
        $this->assertSame('Alan', $still['first_name']);
        $this->assertSame('Turing', $still['last_name']);
        $this->assertSame('active@example.com', $still['email']);
    }

    private function insertSubscriber(
        string $email,
        string $status,
        string $first,
        string $last,
        ?string $unsubscribedAt,
    ): int {
        return (int) (new SubscriberModel())->insert([
            'email' => $email,
            'first_name' => $first,
            'last_name' => $last,
            'status' => $status,
            'consented_at' => '2026-01-01 00:00:00',
            'unsubscribed_at' => $unsubscribedAt,
        ], true);
    }
}
