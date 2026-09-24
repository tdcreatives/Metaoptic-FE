<?php
declare(strict_types=1);

namespace Tests\Unit\Email;

use App\Libraries\Email\UnsubscribeToken;
use CodeIgniter\Test\CIUnitTestCase;

final class UnsubscribeTokenTest extends CIUnitTestCase
{
    public function test_token_is_deterministic_per_subscriber(): void
    {
        $tok = new UnsubscribeToken('unit-test-secret-min-32-chars-long!!');
        $plain = $tok->forSubscriber(42);
        $this->assertSame($plain, $tok->forSubscriber(42));
        $this->assertTrue($tok->matches($plain, $tok->hashPlain($plain)));
    }

    public function test_token_differs_by_subscriber_and_mismatch_fails(): void
    {
        $tok = new UnsubscribeToken('unit-test-secret-min-32-chars-long!!');
        $this->assertNotSame($tok->forSubscriber(1), $tok->forSubscriber(2));
        $this->assertFalse($tok->matches($tok->forSubscriber(1), $tok->hashPlain($tok->forSubscriber(2))));
    }

    public function test_page_url_matches_delivery_shape(): void
    {
        $tok = new UnsubscribeToken('unit-test-secret-min-32-chars-long!!');
        $cfg = config(\Config\EmailAlerts::class);
        $cfg->publicSiteUrl = 'https://metaoptics.sg';
        $plain = $tok->forSubscriber(7);
        $this->assertSame(
            'https://metaoptics.sg/investor-relations/resources/email-alerts?unsub=' . $plain,
            $tok->pageUrl($plain)
        );
    }

    public function test_empty_secret_throws(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new UnsubscribeToken('');
    }

    public function test_short_secret_throws(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        new UnsubscribeToken(str_repeat('a', 31));
    }
}
