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
}
